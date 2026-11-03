export type ChristmasMode = 'auto' | 'on' | 'off';

export function isChristmasSeason(month: number, day: number, mode: ChristmasMode = 'auto') {
  if (mode === 'on') return true;
  if (mode === 'off') return false;
  return month === 12 || (month === 1 && day <= 6);
}
