import { objects, walls, type Point } from "../data/objects";
const STEP = 0.25;
const RADIUS = 0.22;
const obstacles = [...walls, ...objects];
export function isWalkable([x, z]: Point): boolean {
  if (x < -5.65 || x > 5.65 || z < -4.65 || z > 4.65) return false;
  return !obstacles.some(
    (o) =>
      Math.abs(x - o.position[0]) < o.size[0] / 2 + RADIUS &&
      Math.abs(z - o.position[1]) < o.size[1] / 2 + RADIUS,
  );
}
export function segmentClear(a: Point, b: Point): boolean {
  const steps = Math.max(
    1,
    Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.08),
  );
  for (let i = 0; i <= steps; i++)
    if (
      !isWalkable([
        a[0] + ((b[0] - a[0]) * i) / steps,
        a[1] + ((b[1] - a[1]) * i) / steps,
      ])
    )
      return false;
  return true;
}
export function findPath(start: Point, end: Point): Point[] | null {
  if (!isWalkable(end)) return null;
  if (segmentClear(start, end)) return [end];
  const key = (p: Point) => `${p[0]},${p[1]}`;
  const snap = (p: Point): Point => [
    Math.round(p[0] / STEP) * STEP,
    Math.round(p[1] / STEP) * STEP,
  ];
  let origin = snap(start);
  if (!segmentClear(start, origin)) {
    const candidates: Point[] = [];
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++)
        candidates.push([origin[0] + dx * STEP, origin[1] + dz * STEP]);
    const valid = candidates
      .filter((p) => segmentClear(start, p))
      .sort(
        (a, b) =>
          Math.hypot(a[0] - start[0], a[1] - start[1]) -
          Math.hypot(b[0] - start[0], b[1] - start[1]),
      );
    if (!valid.length) return null;
    origin = valid[0];
  }
  const open: Point[] = [origin],
    visited = new Set<string>(),
    parents = new Map<string, Point>(),
    cost = new Map([[key(origin), 0]]);
  const h = (p: Point) => Math.hypot(p[0] - end[0], p[1] - end[1]);
  while (open.length) {
    open.sort((a, b) => cost.get(key(a))! + h(a) - (cost.get(key(b))! + h(b)));
    const current = open.shift()!,
      k = key(current);
    if (visited.has(k)) continue;
    visited.add(k);
    if (h(current) < 0.4 && segmentClear(current, end)) {
      const path: Point[] = [end, current];
      let c = current;
      while (parents.has(key(c))) {
        c = parents.get(key(c))!;
        path.push(c);
      }
      path.reverse();
      const smooth: Point[] = [];
      let anchor = start;
      for (let i = 0; i < path.length; i++) {
        let far = i;
        while (far + 1 < path.length && segmentClear(anchor, path[far + 1]))
          far++;
        smooth.push(path[far]);
        anchor = path[far];
        i = far;
      }
      return smooth;
    }
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const next: Point = [current[0] + dx * STEP, current[1] + dz * STEP],
        nk = key(next);
      if (visited.has(nk) || !segmentClear(current, next)) continue;
      const g = cost.get(k)! + Math.hypot(dx, dz) * STEP;
      if (g < (cost.get(nk) ?? Infinity)) {
        cost.set(nk, g);
        parents.set(nk, current);
        open.push(next);
      }
    }
  }
  return null;
}
