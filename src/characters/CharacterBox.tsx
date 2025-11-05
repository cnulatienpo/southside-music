import type { CSSProperties, ReactNode } from "react";

export type CharacterBoxProps = {
  name: string;
  mood: string;
  line: string;
  icon?: ReactNode;
  delay?: number;
};

type CharacterStyle = {
  container: string;
  header: string;
  mood: string;
  bubble: string;
  tag: string;
  iconClass: string;
  icon?: ReactNode;
};

const characterStyles: Record<string, CharacterStyle> = {
  Buzz: {
    container:
      "bg-gradient-to-br from-fuchsia-900/70 to-zinc-900 border border-fuchsia-500/40 text-pink-100 shadow-[0_20px_60px_-25px_rgba(255,0,170,0.6)]",
    header: "text-3xl font-black tracking-[0.2em] uppercase text-pink-200 drop-shadow-[0_0_16px_rgba(255,0,200,0.75)]",
    mood: "text-xs uppercase tracking-[0.5em] text-pink-300/80",
    bubble:
      "bg-fuchsia-600/80 border border-fuchsia-300/60 text-white shadow-[0_0_35px_rgba(255,0,190,0.45)]",
    tag: "bg-fuchsia-600/80 border-l border-b border-fuchsia-300/70",
    iconClass: "text-4xl drop-shadow-[0_0_12px_rgba(255,0,200,0.9)]",
    icon: "⚡",
  },
  Thump: {
    container:
      "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 border border-amber-500/40 text-zinc-100 shadow-[0_24px_40px_-30px_rgba(255,196,0,0.45)]",
    header: "text-3xl font-black uppercase tracking-[0.3em] text-amber-200",
    mood: "text-xs uppercase tracking-[0.4em] text-amber-300/80",
    bubble:
      "bg-zinc-800/90 border border-amber-400/40 text-amber-100 shadow-[0_0_28px_rgba(255,200,0,0.25)]",
    tag: "bg-zinc-800/90 border-l border-b border-amber-400/60",
    iconClass: "text-4xl text-amber-300 drop-shadow-[0_0_14px_rgba(255,200,0,0.65)]",
    icon: "🥁",
  },
  Scream: {
    container:
      "bg-gradient-to-br from-red-950 via-black to-zinc-950 border border-red-700/60 text-red-100 shadow-[0_25px_55px_-25px_rgba(255,0,80,0.6)]",
    header:
      "text-3xl font-black uppercase tracking-[0.35em] text-red-200 drop-shadow-[0_0_18px_rgba(255,0,70,0.8)]",
    mood: "text-xs uppercase tracking-[0.5em] text-red-400/80",
    bubble:
      "bg-red-700/80 border border-red-500/70 text-red-50 shadow-[0_0_30px_rgba(255,0,80,0.45)]",
    tag: "bg-red-700/80 border-l border-b border-red-500/70",
    iconClass: "text-4xl text-red-200 drop-shadow-[0_0_16px_rgba(255,0,90,0.85)]",
    icon: "🩸",
  },
  Mouth: {
    container:
      "bg-gradient-to-br from-amber-100 via-amber-200 to-stone-200 border border-amber-500/40 text-stone-900 shadow-[0_20px_45px_-25px_rgba(190,120,40,0.35)]",
    header: "text-3xl font-serif font-black tracking-[0.2em] text-amber-800",
    mood: "text-xs uppercase tracking-[0.45em] text-amber-700/80",
    bubble:
      "bg-amber-50/90 border border-amber-300/70 text-amber-900 shadow-[0_0_25px_rgba(200,150,70,0.25)]",
    tag: "bg-amber-50/90 border-l border-b border-amber-300/70",
    iconClass: "text-4xl text-amber-800 drop-shadow-[0_0_10px_rgba(200,140,80,0.45)]",
    icon: "📜",
  },
  Spark: {
    container:
      "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border border-sky-500/40 text-sky-100 shadow-[0_30px_70px_-35px_rgba(80,160,255,0.5)]",
    header:
      "text-3xl font-black uppercase tracking-[0.25em] text-sky-200 drop-shadow-[0_0_22px_rgba(120,200,255,0.75)]",
    mood: "text-xs uppercase tracking-[0.4em] text-sky-300/80",
    bubble:
      "bg-slate-900/90 border border-sky-400/50 text-sky-100 shadow-[0_0_30px_rgba(110,200,255,0.45)]",
    tag: "bg-slate-900/90 border-l border-b border-sky-400/60",
    iconClass: "text-4xl text-sky-300 drop-shadow-[0_0_16px_rgba(140,210,255,0.7)]",
    icon: "🎷",
  },
};

const defaultStyle: CharacterStyle = {
  container:
    "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700/60 text-zinc-100 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.6)]",
  header: "text-3xl font-black uppercase tracking-[0.25em] text-zinc-100",
  mood: "text-xs uppercase tracking-[0.4em] text-zinc-400",
  bubble:
    "bg-zinc-800/90 border border-zinc-600/70 text-zinc-100 shadow-[0_0_25px_rgba(0,0,0,0.35)]",
  tag: "bg-zinc-800/90 border-l border-b border-zinc-600/70",
  iconClass: "text-4xl text-zinc-200",
  icon: "💬",
};

const CharacterBox = ({ name, mood, line, icon, delay = 0 }: CharacterBoxProps) => {
  const style = characterStyles[name] ?? defaultStyle;
  const animationStyle: CSSProperties | undefined = delay
    ? { animationDelay: `${delay}ms` }
    : undefined;

  return (
    <div
      className={`w-full max-w-xl rounded-3xl px-7 py-6 font-sans backdrop-blur-sm ${style.container}`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className={`tracking-[0.6em] ${style.mood}`}>{mood}</p>
          <h3 className={style.header}>{name}</h3>
        </div>
        {(icon ?? style.icon) && (
          <span className={style.iconClass} aria-hidden>
            {icon ?? style.icon}
          </span>
        )}
      </header>

      <div className="mt-5 flex flex-col gap-2">
        <div
          className={`relative inline-flex rounded-2xl px-6 py-5 text-lg font-semibold leading-relaxed ${style.bubble} animate-pulse`}
          style={animationStyle}
        >
          <span>{line}</span>
          <span
            className={`absolute left-12 -bottom-3 h-6 w-6 rotate-45 ${style.tag}`}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterBox;
