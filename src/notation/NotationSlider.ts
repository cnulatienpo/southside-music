export const mapSliderToSettings = (value: number) => {
  const level = Math.min(Math.max(value, 0), 100);
  return {
    level,
    showLines: level >= 10,
    showStaff: level >= 60,
    showRealNoteheads: level >= 80,
  };
};
