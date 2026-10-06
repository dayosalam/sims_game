import { test } from "node:test";
import assert from "node:assert/strict";
import { objects, type Point } from "../data/objects";
import { findPath, isWalkable, segmentClear } from "./pathfinding";
import { advanceMovement, changeNeeds, formatTime } from "./simulation";
import { useGameStore } from "../store/gameStore";
const interactionPoints = objects.flatMap((o) =>
  o.interactionPoint ? [o.interactionPoint] : [],
);
test("every interaction can be reached from every other interaction without crossing obstacles", () => {
  for (const start of [[-2, 0.9] as Point, ...interactionPoints])
    for (const end of interactionPoints) {
      assert.ok(isWalkable(end), `Blocked endpoint ${end}`);
      const path = findPath(start, end);
      assert.ok(path, `No route from ${start} to ${end}`);
      let previous = start;
      for (const p of path) {
        assert.ok(
          segmentClear(previous, p),
          `Unsafe segment ${previous} -> ${p}`,
        );
        previous = p;
      }
      assert.deepEqual(path.at(-1), end);
    }
});
test("walls, furniture and outside locations reject destinations", () => {
  for (const p of [
    [0, 0],
    [-3.8, -3.2],
    [6.5, 0],
    [0, -4],
    [2.8, -2.35],
  ] as Point[])
    assert.equal(findPath([-2, 0.9], p), null);
});
test("movement consumes long frames without overshooting or leaving a clear route", () => {
  const result = advanceMovement(
    [0, 0],
    [
      [1, 0],
      [1, 1],
    ],
    1.5,
  );
  assert.deepEqual(result.position, [1, 0.5]);
  assert.deepEqual(result.path, [[1, 1]]);
  assert.deepEqual(advanceMovement([0, 0], [[1, 0]], 10).position, [1, 0]);
});
test("needs clamp at bounds and effects restore only intended needs", () => {
  const changed = changeNeeds(
    { hunger: 99, energy: 0, hygiene: 50, fun: 50 },
    10,
    { hunger: 10 },
  );
  assert.equal(changed.hunger, 100);
  assert.equal(changed.energy, 0);
  assert.ok(changed.hygiene < 50);
  assert.ok(changed.fun < 50);
});
test("clock crosses noon, midnight and week boundary correctly", () => {
  assert.deepEqual(formatTime(720), {
    day: "Monday",
    time: "12:00",
    period: "PM",
  });
  assert.deepEqual(formatTime(1440), {
    day: "Tuesday",
    time: "12:00",
    period: "AM",
  });
  assert.equal(formatTime(7 * 1440).day, "Monday");
});
test("pause freezes position, activity, needs and clock; speed scales the simulation", () => {
  const initial = useGameStore.getState();
  useGameStore.getState().moveTo([-2, 1.3]);
  useGameStore.getState().setSpeed(0);
  const before = useGameStore.getState();
  before.tick(0.1);
  const after = useGameStore.getState();
  assert.deepEqual(after.position, before.position);
  assert.deepEqual(after.needs, before.needs);
  assert.equal(after.minutes, before.minutes);
  after.setSpeed(3);
  useGameStore.getState().tick(0.1);
  assert.ok(
    Math.abs(useGameStore.getState().minutes - before.minutes - 0.6) < 1e-8,
  );
  useGameStore.setState(initial, true);
});
test("complete every activity through walking, action and need recovery", () => {
  const initial = useGameStore.getState();
  for (const object of objects.filter((o) => o.interactions.length)) {
    useGameStore.setState({
      ...initial,
      needs: { hunger: 30, energy: 30, hygiene: 30, fun: 30 },
    });
    useGameStore.getState().interact(object.id, 0);
    let started = false;
    for (let i = 0; i < 1500 && useGameStore.getState().task; i++) {
      useGameStore.getState().tick(0.1);
      started ||= !!useGameStore.getState().task?.started;
    }
    const state = useGameStore.getState();
    assert.ok(started, `${object.id} did not start`);
    assert.equal(state.task, null, `${object.id} did not finish`);
    assert.equal(state.action, "Idle");
    assert.deepEqual(state.position, object.interactionPoint);
    for (const need of Object.keys(object.interactions[0].effects))
      assert.ok(
        state.needs[need as keyof typeof state.needs] > 30,
        `${object.id} did not restore ${need}`,
      );
  }
  useGameStore.setState(initial, true);
});
