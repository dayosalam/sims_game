import { needDefinitions } from "../data/needs";
import type { Need, Point } from "../data/objects";
export function changeNeeds(
  needs: Record<Need, number>,
  seconds: number,
  effects: Partial<Record<Need, number>> = {},
) {
  return Object.fromEntries(
    needDefinitions.map((n) => [
      n.id,
      Math.max(
        0,
        Math.min(100, needs[n.id] + ((effects[n.id] ?? 0) - n.decay) * seconds),
      ),
    ]),
  ) as Record<Need, number>;
}
export function advanceMovement(
  position: Point,
  path: Point[],
  distance: number,
): { position: Point; path: Point[]; angle: number | null } {
  let p: Point = [...position],
    remaining = [...path],
    angle: number | null = null;
  while (remaining.length && distance > 0) {
    const target = remaining[0],
      dx = target[0] - p[0],
      dz = target[1] - p[1],
      length = Math.hypot(dx, dz);
    if (length > 0.0001) angle = Math.atan2(dx, dz);
    if (length <= distance) {
      p = [...target];
      distance -= length;
      remaining.shift();
    } else {
      p = [p[0] + (dx / length) * distance, p[1] + (dz / length) * distance];
      distance = 0;
    }
  }
  return { position: p, path: remaining, angle };
}
export function formatTime(minutes: number) {
  const day = Math.floor(minutes / 1440),
    m = Math.floor(minutes % 1440),
    hour = Math.floor(m / 60);
  return {
    day: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ][day % 7],
    time: `${hour % 12 || 12}:${String(m % 60).padStart(2, "0")}`,
    period: hour < 12 ? "AM" : "PM",
  };
}
