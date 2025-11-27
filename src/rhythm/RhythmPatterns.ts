export const normalizeIntervals = (intervals: number[]): number[] => {
  if (!intervals.length) return [];
  const first = intervals[0] || 1;
  return intervals.map((value) => Number((value / first).toFixed(2)));
};

export const fingerprintRhythm = (intervals: number[]): string => normalizeIntervals(intervals).join("-");
