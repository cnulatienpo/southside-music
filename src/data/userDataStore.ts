import Database from "better-sqlite3";
import { Low, JSONFile } from "lowdb";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import path from "path";
import fs from "fs";
import { Souvenir, StoryChain } from "../circuits/meta/circuitsMetaTypes";

export type UserProfile = {
  id: string;
  createdAt: string;
  displayName?: string;
  preferredModes?: string[];
  lastSeenAt?: string;
};

export type UserSessionEvent = {
  id: string;
  userId: string;
  type: "login" | "logout" | "session_start" | "session_end";
  timestamp: string;
  metadata?: Record<string, any>;
};

export type EarTrainingLogEntry = {
  id: string;
  userId: string;
  createdAt: string;
  exerciseType: string;
  difficultyLevel?: number;
  userResponse: string;
  systemContext?: Record<string, any>;
};

export type LearningRecordLogEntry = {
  id: string;
  userId: string;
  createdAt: string;
  rawText: string;
  clipContext?: string | null;
  classification: Record<string, any>;
  vocabularyMappings: Array<Record<string, any>>;
  suggestedTheory?: string[];
  suggestedExercises?: string[];
};

export type DojoEventLogEntry = {
  id: string;
  userId: string;
  createdAt: string;
  drillName: string;
  category: string;
  userResponse: string;
  prompt: string;
  followUp?: string | null;
  metadata?: Record<string, any>;
};

export type TheftHeistReport = {
  id: string;
  userId: string;
  createdAt: string;
  sourceDescription: string;
  heistMode: "form" | "context" | "mixed";
  perceivedRuthlessness?: number;
  perceivedCreativity?: number;
  perceivedEffort?: number;
  notes?: string;
};

export type ModeUsageEvent = {
  id: string;
  userId: string;
  modeName: "theft" | "lab" | "dojo" | "garden" | "bazaar" | "archives";
  action: "enter" | "exit";
  timestamp: string;
  metadata?: Record<string, any>;
};

export type LowDBSchema = {
  profile: UserProfile | null;
  lastSessionId?: string;
  customData?: Record<string, any>;
};

type ConstructorOptions = {
  dbPath?: string;
  jsonPath?: string;
};

export class UserDataStore {
  private db!: any;
  private lowdb!: Low<LowDBSchema>;
  private initialized = false;
  private readonly dbPath: string;
  private readonly jsonPath: string;

  constructor(options?: ConstructorOptions) {
    this.dbPath = options?.dbPath ?? "./soutshide_music.db";
    this.jsonPath = options?.jsonPath ?? "./user_profile.json";
  }

  public async init(): Promise<void> {
    try {
      this.ensureStoragePaths();
      this.db = new Database(this.dbPath);

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          display_name TEXT,
          preferred_modes TEXT,
          last_seen_at TEXT
        );

        CREATE TABLE IF NOT EXISTS session_events (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          metadata TEXT
        );

        CREATE TABLE IF NOT EXISTS ear_training_logs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          exercise_type TEXT NOT NULL,
          difficulty_level INTEGER,
          user_response TEXT NOT NULL,
          system_context TEXT
        );

        CREATE TABLE IF NOT EXISTS learning_records (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          raw_text TEXT NOT NULL,
          clip_context TEXT,
          classification_json TEXT,
          vocabulary_mappings_json TEXT,
          suggested_theory_json TEXT,
          suggested_exercises_json TEXT
        );

        CREATE TABLE IF NOT EXISTS dojo_events (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          drill_name TEXT NOT NULL,
          category TEXT NOT NULL,
          user_response TEXT NOT NULL,
          prompt TEXT NOT NULL,
          follow_up TEXT,
          metadata TEXT
        );

        CREATE TABLE IF NOT EXISTS theft_heists (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          source_description TEXT NOT NULL,
          heist_mode TEXT NOT NULL,
          perceived_ruthlessness INTEGER,
          perceived_creativity INTEGER,
          perceived_effort INTEGER,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS mode_usage (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          mode_name TEXT NOT NULL,
          action TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          metadata TEXT
        );

        CREATE TABLE IF NOT EXISTS circuits_runs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          chain_json TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS circuits_souvenirs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          label TEXT NOT NULL,
          type TEXT NOT NULL,
          metadata TEXT,
          created_at TEXT NOT NULL
        );
      `);

      const adapter = new JSONFile<LowDBSchema>(this.jsonPath);
      this.lowdb = new Low<LowDBSchema>(adapter);
      this.lowdb.data = { profile: null, customData: {} };
      await this.lowdb.read();
      if (!this.lowdb.data) {
        this.lowdb.data = { profile: null, customData: {} };
      }
      if (!this.lowdb.data.customData) {
        this.lowdb.data.customData = {};
      }
      await this.lowdb.write();

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize UserDataStore", error);
      throw error;
    }
  }

  public async getOrCreateProfile(): Promise<UserProfile> {
    this.ensureInitialized();
    try {
      await this.lowdb.read();
      const existingProfile = this.lowdb.data?.profile;
      if (existingProfile) {
        return existingProfile;
      }

      const newProfile: UserProfile = {
        id: nanoid(),
        createdAt: dayjs().toISOString(),
      };

      const insertProfile = this.db.prepare(
        `INSERT INTO user_profile (id, created_at, display_name, preferred_modes, last_seen_at)
         VALUES (@id, @createdAt, @displayName, @preferredModes, @lastSeenAt)`
      );

      insertProfile.run({
        id: newProfile.id,
        createdAt: newProfile.createdAt,
        displayName: newProfile.displayName ?? null,
        preferredModes: newProfile.preferredModes ? JSON.stringify(newProfile.preferredModes) : null,
        lastSeenAt: newProfile.lastSeenAt ?? null,
      });

      if (!this.lowdb.data) {
        this.lowdb.data = { profile: null, customData: {} };
      }
      if (!this.lowdb.data.customData) {
        this.lowdb.data.customData = {};
      }
      this.lowdb.data.profile = newProfile;
      await this.lowdb.write();

      return newProfile;
    } catch (error) {
      console.error("Failed to get or create profile", error);
      throw error;
    }
  }

  public async updateProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
    this.ensureInitialized();
    try {
      const currentProfile = this.lowdb.data?.profile ?? (await this.getOrCreateProfile());
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...partial,
        id: currentProfile.id,
        createdAt: currentProfile.createdAt,
      };

      const updateProfileStmt = this.db.prepare(
        `REPLACE INTO user_profile (id, created_at, display_name, preferred_modes, last_seen_at)
         VALUES (@id, @createdAt, @displayName, @preferredModes, @lastSeenAt)`
      );

      updateProfileStmt.run({
        id: updatedProfile.id,
        createdAt: updatedProfile.createdAt,
        displayName: updatedProfile.displayName ?? null,
        preferredModes: updatedProfile.preferredModes ? JSON.stringify(updatedProfile.preferredModes) : null,
        lastSeenAt: updatedProfile.lastSeenAt ?? null,
      });

      if (!this.lowdb.data) {
        this.lowdb.data = { profile: null, customData: {} };
      }
      if (!this.lowdb.data.customData) {
        this.lowdb.data.customData = {};
      }
      this.lowdb.data.profile = updatedProfile;
      await this.lowdb.write();

      return updatedProfile;
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  }

  public async logSessionEvent(
    event: Omit<UserSessionEvent, "id" | "timestamp"> & { timestamp?: string }
  ): Promise<UserSessionEvent> {
    this.ensureInitialized();
    const fullEvent: UserSessionEvent = {
      ...event,
      id: nanoid(),
      timestamp: event.timestamp ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `INSERT INTO session_events (id, user_id, type, timestamp, metadata)
         VALUES (@id, @userId, @type, @timestamp, @metadata)`
      );

      stmt.run({
        id: fullEvent.id,
        userId: fullEvent.userId,
        type: fullEvent.type,
        timestamp: fullEvent.timestamp,
        metadata: fullEvent.metadata ? JSON.stringify(fullEvent.metadata) : null,
      });

      return fullEvent;
    } catch (error) {
      console.error("Failed to log session event", error);
      throw error;
    }
  }

  public async logEarTraining(
    entry: Omit<EarTrainingLogEntry, "id" | "createdAt"> & { createdAt?: string }
  ): Promise<EarTrainingLogEntry> {
    this.ensureInitialized();
    const fullEntry: EarTrainingLogEntry = {
      ...entry,
      id: nanoid(),
      createdAt: entry.createdAt ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `INSERT INTO ear_training_logs (
          id,
          user_id,
          created_at,
          exercise_type,
          difficulty_level,
          user_response,
          system_context
        ) VALUES (@id, @userId, @createdAt, @exerciseType, @difficultyLevel, @userResponse, @systemContext)`
      );

      stmt.run({
        id: fullEntry.id,
        userId: fullEntry.userId,
        createdAt: fullEntry.createdAt,
        exerciseType: fullEntry.exerciseType,
        difficultyLevel: fullEntry.difficultyLevel ?? null,
        userResponse: fullEntry.userResponse,
        systemContext: fullEntry.systemContext ? JSON.stringify(fullEntry.systemContext) : null,
      });

      return fullEntry;
    } catch (error) {
      console.error("Failed to log ear training entry", error);
      throw error;
    }
  }

  public async logLearningRecord(
    record: Omit<LearningRecordLogEntry, "id" | "createdAt"> & { createdAt?: string }
  ): Promise<LearningRecordLogEntry> {
    this.ensureInitialized();
    const fullRecord: LearningRecordLogEntry = {
      ...record,
      id: nanoid(),
      createdAt: record.createdAt ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `INSERT INTO learning_records (
          id,
          user_id,
          created_at,
          raw_text,
          clip_context,
          classification_json,
          vocabulary_mappings_json,
          suggested_theory_json,
          suggested_exercises_json
        ) VALUES (
          @id,
          @userId,
          @createdAt,
          @rawText,
          @clipContext,
          @classificationJson,
          @vocabularyMappingsJson,
          @suggestedTheoryJson,
          @suggestedExercisesJson
        )`
      );

      stmt.run({
        id: fullRecord.id,
        userId: fullRecord.userId,
        createdAt: fullRecord.createdAt,
        rawText: fullRecord.rawText,
        clipContext: fullRecord.clipContext ?? null,
        classificationJson: JSON.stringify(fullRecord.classification ?? {}),
        vocabularyMappingsJson: JSON.stringify(fullRecord.vocabularyMappings ?? []),
        suggestedTheoryJson: fullRecord.suggestedTheory ? JSON.stringify(fullRecord.suggestedTheory) : null,
        suggestedExercisesJson: fullRecord.suggestedExercises
          ? JSON.stringify(fullRecord.suggestedExercises)
          : null,
      });

      return fullRecord;
    } catch (error) {
      console.error("Failed to log learning record", error);
      throw error;
    }
  }

  public async logDojoEvent(
    event: Omit<DojoEventLogEntry, "id" | "createdAt"> & { createdAt?: string }
  ): Promise<DojoEventLogEntry> {
    this.ensureInitialized();
    const fullEvent: DojoEventLogEntry = {
      ...event,
      id: nanoid(),
      createdAt: event.createdAt ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `INSERT INTO dojo_events (
          id,
          user_id,
          created_at,
          drill_name,
          category,
          user_response,
          prompt,
          follow_up,
          metadata
        ) VALUES (@id, @userId, @createdAt, @drillName, @category, @userResponse, @prompt, @followUp, @metadata)`
      );

      stmt.run({
        id: fullEvent.id,
        userId: fullEvent.userId,
        createdAt: fullEvent.createdAt,
        drillName: fullEvent.drillName,
        category: fullEvent.category,
        userResponse: fullEvent.userResponse,
        prompt: fullEvent.prompt,
        followUp: fullEvent.followUp ?? null,
        metadata: fullEvent.metadata ? JSON.stringify(fullEvent.metadata) : null,
      });

      return fullEvent;
    } catch (error) {
      console.error("Failed to log dojo event", error);
      throw error;
    }
  }

  public async getEarTrainingHistory(userId: string, limit = 100): Promise<EarTrainingLogEntry[]> {
    this.ensureInitialized();
    try {
      const stmt = this.db.prepare(
        `SELECT * FROM ear_training_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
      );
      const rows = stmt.all(userId, limit) as Array<{
        id: string;
        user_id: string;
        created_at: string;
        exercise_type: string;
        difficulty_level: number | null;
        user_response: string;
        system_context: string | null;
      }>;

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        createdAt: row.created_at,
        exerciseType: row.exercise_type,
        difficultyLevel: row.difficulty_level ?? undefined,
        userResponse: row.user_response,
        systemContext: row.system_context ? JSON.parse(row.system_context) : undefined,
      }));
    } catch (error) {
      console.error("Failed to fetch ear training history", error);
      throw error;
    }
  }

  public async logTheftHeist(
    report: Omit<TheftHeistReport, "id" | "createdAt"> & { createdAt?: string }
  ): Promise<TheftHeistReport> {
    this.ensureInitialized();
    const fullReport: TheftHeistReport = {
      ...report,
      id: nanoid(),
      createdAt: report.createdAt ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `INSERT INTO theft_heists (
          id,
          user_id,
          created_at,
          source_description,
          heist_mode,
          perceived_ruthlessness,
          perceived_creativity,
          perceived_effort,
          notes
        ) VALUES (
          @id,
          @userId,
          @createdAt,
          @sourceDescription,
          @heistMode,
          @perceivedRuthlessness,
          @perceivedCreativity,
          @perceivedEffort,
          @notes
        )`
      );

      stmt.run({
        id: fullReport.id,
        userId: fullReport.userId,
        createdAt: fullReport.createdAt,
        sourceDescription: fullReport.sourceDescription,
        heistMode: fullReport.heistMode,
        perceivedRuthlessness: fullReport.perceivedRuthlessness ?? null,
        perceivedCreativity: fullReport.perceivedCreativity ?? null,
        perceivedEffort: fullReport.perceivedEffort ?? null,
        notes: fullReport.notes ?? null,
      });

      return fullReport;
    } catch (error) {
      console.error("Failed to log theft heist report", error);
      throw error;
    }
  }

  public async getTheftHistory(userId: string, limit = 100): Promise<TheftHeistReport[]> {
    this.ensureInitialized();
    try {
      const stmt = this.db.prepare(
        `SELECT * FROM theft_heists WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
      );
      const rows = stmt.all(userId, limit) as Array<{
        id: string;
        user_id: string;
        created_at: string;
        source_description: string;
        heist_mode: "form" | "context" | "mixed";
        perceived_ruthlessness: number | null;
        perceived_creativity: number | null;
        perceived_effort: number | null;
        notes: string | null;
      }>;

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        createdAt: row.created_at,
        sourceDescription: row.source_description,
        heistMode: row.heist_mode,
        perceivedRuthlessness: row.perceived_ruthlessness ?? undefined,
        perceivedCreativity: row.perceived_creativity ?? undefined,
        perceivedEffort: row.perceived_effort ?? undefined,
        notes: row.notes ?? undefined,
      }));
    } catch (error) {
      console.error("Failed to fetch theft history", error);
      throw error;
    }
  }

  public async logModeUsage(
    event: Omit<ModeUsageEvent, "id" | "timestamp"> & { timestamp?: string }
  ): Promise<ModeUsageEvent> {
    this.ensureInitialized();
    const fullEvent: ModeUsageEvent = {
      ...event,
      id: nanoid(),
      timestamp: event.timestamp ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `INSERT INTO mode_usage (id, user_id, mode_name, action, timestamp, metadata)
         VALUES (@id, @userId, @modeName, @action, @timestamp, @metadata)`
      );

      stmt.run({
        id: fullEvent.id,
        userId: fullEvent.userId,
        modeName: fullEvent.modeName,
        action: fullEvent.action,
        timestamp: fullEvent.timestamp,
        metadata: fullEvent.metadata ? JSON.stringify(fullEvent.metadata) : null,
      });

      return fullEvent;
    } catch (error) {
      console.error("Failed to log mode usage", error);
      throw error;
    }
  }

  public async getModeUsageSummary(
    userId: string
  ): Promise<Record<string, { enters: number; exits: number }>> {
    this.ensureInitialized();
    try {
      const stmt = this.db.prepare(`SELECT mode_name, action FROM mode_usage WHERE user_id = ?`);
      const rows = stmt.all(userId) as Array<{ mode_name: string; action: string }>;

      const summary: Record<string, { enters: number; exits: number }> = {};

      for (const row of rows) {
        const mode = row.mode_name;
        if (!summary[mode]) {
          summary[mode] = { enters: 0, exits: 0 };
        }
        if (row.action === "enter") {
          summary[mode].enters += 1;
        } else if (row.action === "exit") {
          summary[mode].exits += 1;
        }
      }

      return summary;
    } catch (error) {
      console.error("Failed to get mode usage summary", error);
      throw error;
    }
  }

  public async saveCircuitRun(chain: StoryChain): Promise<StoryChain> {
    this.ensureInitialized();
    const fullChain: StoryChain = {
      ...chain,
      id: chain.id ?? nanoid(),
      createdAt: chain.createdAt ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `REPLACE INTO circuits_runs (id, user_id, created_at, chain_json)
         VALUES (@id, @userId, @createdAt, @chainJson)`
      );

      stmt.run({
        id: fullChain.id,
        userId: fullChain.userId,
        createdAt: fullChain.createdAt,
        chainJson: JSON.stringify(fullChain),
      });

      return fullChain;
    } catch (error) {
      console.error("Failed to save circuit run", error);
      throw error;
    }
  }

  public async listCircuitRuns(userId: string, limit = 20): Promise<StoryChain[]> {
    this.ensureInitialized();
    try {
      const stmt = this.db.prepare(
        `SELECT chain_json FROM circuits_runs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
      );
      const rows = stmt.all(userId, limit) as Array<{ chain_json: string }>;

      return rows.map((row) => JSON.parse(row.chain_json) as StoryChain);
    } catch (error) {
      console.error("Failed to list circuit runs", error);
      throw error;
    }
  }

  public async getCircuitRun(chainId: string): Promise<StoryChain | null> {
    this.ensureInitialized();
    try {
      const stmt = this.db.prepare(`SELECT chain_json FROM circuits_runs WHERE id = ?`);
      const row = stmt.get(chainId) as { chain_json: string } | undefined;

      if (!row?.chain_json) {
        return null;
      }

      return JSON.parse(row.chain_json) as StoryChain;
    } catch (error) {
      console.error("Failed to fetch circuit run", error);
      throw error;
    }
  }

  public async saveSouvenir(
    souvenir: Omit<Souvenir, "id" | "createdAt"> & { id?: string; createdAt?: string }
  ): Promise<Souvenir> {
    this.ensureInitialized();
    const fullSouvenir: Souvenir = {
      ...souvenir,
      id: souvenir.id ?? nanoid(),
      createdAt: souvenir.createdAt ?? dayjs().toISOString(),
    };

    try {
      const stmt = this.db.prepare(
        `REPLACE INTO circuits_souvenirs (id, user_id, label, type, metadata, created_at)
         VALUES (@id, @userId, @label, @type, @metadata, @createdAt)`
      );

      stmt.run({
        id: fullSouvenir.id,
        userId: fullSouvenir.userId,
        label: fullSouvenir.label,
        type: fullSouvenir.type,
        metadata: fullSouvenir.metadata ? JSON.stringify(fullSouvenir.metadata) : null,
        createdAt: fullSouvenir.createdAt,
      });

      return fullSouvenir;
    } catch (error) {
      console.error("Failed to save souvenir", error);
      throw error;
    }
  }

  public async listSouvenirs(userId: string, limit = 50): Promise<Souvenir[]> {
    this.ensureInitialized();
    try {
      const stmt = this.db.prepare(
        `SELECT * FROM circuits_souvenirs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
      );
      const rows = stmt.all(userId, limit) as Array<{
        id: string;
        user_id: string;
        label: string;
        type: string;
        metadata: string | null;
        created_at: string;
      }>;

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        label: row.label,
        type: row.type,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error("Failed to fetch souvenirs", error);
      throw error;
    }
  }

  public async getCustomData<T>(key: string): Promise<T | undefined> {
    this.ensureInitialized();
    await this.lowdb.read();
    if (!this.lowdb.data) {
      this.lowdb.data = { profile: null, customData: {} };
    }
    if (!this.lowdb.data.customData) {
      this.lowdb.data.customData = {};
    }

    return this.lowdb.data.customData[key] as T | undefined;
  }

  public async setCustomData<T>(key: string, value: T): Promise<void> {
    this.ensureInitialized();
    await this.lowdb.read();
    if (!this.lowdb.data) {
      this.lowdb.data = { profile: null, customData: {} };
    }
    if (!this.lowdb.data.customData) {
      this.lowdb.data.customData = {};
    }

    this.lowdb.data.customData[key] = value;
    await this.lowdb.write();
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        "UserDataStore must be initialized by calling init() before use."
      );
    }
  }

  private ensureStoragePaths(): void {
    const dbDir = path.dirname(path.resolve(this.dbPath));
    const jsonDir = path.dirname(path.resolve(this.jsonPath));

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir, { recursive: true });
    }
  }
}

/*
Example usage:

const store = new UserDataStore();
await store.init();
const profile = await store.getOrCreateProfile();
await store.logSessionEvent({ userId: profile.id, type: "session_start" });
await store.logEarTraining({
  userId: profile.id,
  exerciseType: "octave_guess",
  userResponse: "I thought it was low",
});
*/
