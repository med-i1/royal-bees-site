const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Scroll progress (0..1) → frame index (0..frames-1). The first `hold` of the scroll keeps frame 0. */
export function frameForProgress(p: number, frames: number, hold = 0.1, span = 0.8): number {
  return clamp01((p - hold) / span) * (frames - 1);
}

/** Every frame index once, coarse first, so a usable scrub exists before all frames arrive. */
export function frameLoadOrder(frames: number, steps: number[] = [16, 8, 4, 2, 1]): number[] {
  const seen = new Set<number>();
  for (const step of steps) for (let i = 0; i < frames; i += step) seen.add(i);
  for (let i = 0; i < frames; i++) seen.add(i);
  return [...seen];
}
