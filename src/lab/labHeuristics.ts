export function checkPlagiarismRisk(userText: string): boolean {
  const highRiskPatterns = [
    /exact melody/i,
    /specific lyric phrase/i,
    /identifiable chord order/i,
    /exact riff from/i,
    /same chorus/i,
    /exact [^ ]+ from/i,
  ];

  for (const pattern of highRiskPatterns) {
    if (pattern.test(userText)) {
      return true;
    }
  }

  const safeSignals = [
    /shape/i,
    /mood/i,
    /timbre/i,
    /contour/i,
    /energy/i,
    /atmosphere/i,
  ];

  for (const pattern of safeSignals) {
    if (pattern.test(userText)) {
      return false;
    }
  }

  return false;
}
