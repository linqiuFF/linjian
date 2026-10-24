export const START: number;
export const END: number;
export function createEngine(
  canvas: HTMLCanvasElement,
  data: { LYRICS: { t: number; s: string }[]; BEATS: number[] },
): { renderAt: (t: number) => void };
