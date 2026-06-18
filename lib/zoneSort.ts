export function compareZones(a: string, b: string): number {
  const ai = parseInt(a);
  const bi = parseInt(b);
  if (isNaN(ai) && isNaN(bi)) return a.localeCompare(b);
  if (isNaN(ai)) return 1;
  if (isNaN(bi)) return -1;
  return ai - bi;
}
