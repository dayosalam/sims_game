import { create } from "zustand";
import {
  objects,
  type Point,
  type Need,
  type Interaction,
} from "../data/objects";
import { findPath } from "../systems/pathfinding";
import { advanceMovement, changeNeeds } from "../systems/simulation";
type Task = {
  objectId: string;
  interaction: Interaction;
  elapsed: number;
  started: boolean;
};
type State = {
  position: Point;
  path: Point[];
  angle: number;
  destination: Point | null;
  markerLife: number;
  action: string;
  needs: Record<Need, number>;
  minutes: number;
  speed: number;
  lastSpeed: number;
  selected: string | null;
  task: Task | null;
  notice: string;
  cameraCommand: { type: "in" | "out" | "reset"; id: number } | null;
  moveTo: (point: Point) => void;
  select: (id: string | null) => void;
  interact: (id: string, index: number) => void;
  setSpeed: (speed: number) => void;
  togglePause: () => void;
  tick: (delta: number) => void;
  cancel: () => void;
  camera: (type: "in" | "out" | "reset") => void;
};
export const useGameStore = create<State>((set, get) => ({
  position: [-2, 0.9],
  path: [],
  angle: 0,
  destination: null,
  markerLife: 0,
  action: "Idle",
  needs: { hunger: 68, energy: 82, hygiene: 74, fun: 56 },
  minutes: 8 * 60 + 32,
  speed: 1,
  lastSpeed: 1,
  selected: null,
  task: null,
  notice: "Click the floor to take a little wander.",
  cameraCommand: null,
  moveTo: (point) => {
    const path = findPath(get().position, point);
    if (!path) {
      set({
        selected: null,
        notice: "That spot is blocked. Try an open patch of floor.",
      });
      return;
    }
    set({
      path,
      destination: point,
      markerLife: 2.5,
      action: "Walking",
      task: null,
      selected: null,
      notice: "A little change of scenery.",
    });
  },
  select: (selected) => set({ selected }),
  interact: (id, index) => {
    const object = objects.find((o) => o.id === id),
      interaction = object?.interactions[index];
    if (!object?.interactionPoint || !interaction) return;
    const path = findPath(get().position, object.interactionPoint);
    if (!path) {
      set({
        notice: "Alex cannot reach that object from here.",
        selected: null,
      });
      return;
    }
    set({
      path,
      destination: object.interactionPoint,
      markerLife: 2.5,
      action: "Walking",
      selected: null,
      task: { objectId: id, interaction, elapsed: 0, started: false },
      notice: `On the way to ${object.name.toLowerCase()}.`,
    });
  },
  setSpeed: (speed) => set({ speed, lastSpeed: speed || get().lastSpeed }),
  togglePause: () => {
    const s = get();
    s.setSpeed(s.speed ? 0 : s.lastSpeed);
  },
  cancel: () =>
    set({
      task: null,
      path: [],
      destination: null,
      action: "Idle",
      notice: "Taking a moment.",
    }),
  camera: (type) =>
    set({ cameraCommand: { type, id: (get().cameraCommand?.id ?? 0) + 1 } }),
  tick: (delta) => {
    const s = get();
    if (!s.speed) return;
    const dt = Math.min(delta, 0.1) * s.speed;
    let { position, path, angle } = advanceMovement(
      s.position,
      s.path,
      dt * 1.9,
    );
    let task = s.task,
      action = s.action,
      notice = s.notice;
    const effects: Partial<Record<Need, number>> = {};
    if (!path.length) {
      action = "Idle";
      if (task) {
        const object = objects.find((o) => o.id === task!.objectId)!;
        angle = Math.atan2(
          object.position[0] - position[0],
          object.position[1] - position[1],
        );
        const activeTime = Math.min(
          dt,
          task.interaction.duration - task.elapsed,
        );
        task = { ...task, started: true, elapsed: task.elapsed + activeTime };
        action = task.interaction.action;
        for (const [need, value] of Object.entries(task.interaction.effects))
          effects[need as Need] =
            (value / task.interaction.duration) * (activeTime / dt);
        if (task.elapsed >= task.interaction.duration) {
          notice = `${task.interaction.action} complete. What’s next?`;
          task = null;
          action = "Idle";
        }
      }
    }
    set({
      position,
      path,
      angle: angle ?? s.angle,
      task,
      action,
      notice,
      needs: changeNeeds(s.needs, dt, effects),
      minutes: s.minutes + dt * 2,
      markerLife: Math.max(0, s.markerLife - dt),
      destination: path.length ? s.destination : null,
    });
  },
}));
