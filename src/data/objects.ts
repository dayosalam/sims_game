export type Point = [number, number];
export type Need = "hunger" | "energy" | "hygiene" | "fun";
export type Interaction = {
  label: string;
  action: string;
  duration: number;
  effects: Partial<Record<Need, number>>;
  icon: string;
};
export type HomeObject = {
  id: string;
  name: string;
  kind: string;
  position: Point;
  size: Point;
  rotation?: number;
  interactionPoint?: Point;
  interactions: Interaction[];
};
export const objects: HomeObject[] = [
  {
    id: "living-plant",
    name: "Living room plant",
    kind: "plant",
    position: [-5.3, 0.85],
    size: [0.45, 0.45],
    interactions: [],
  },
  {
    id: "bedroom-plant",
    name: "Bedroom plant",
    kind: "plant",
    position: [-0.65, -4.35],
    size: [0.45, 0.45],
    interactions: [],
  },
  {
    id: "sofa",
    name: "Sunday sofa",
    kind: "sofa",
    position: [-4.6, 2.5],
    size: [1.05, 2.7],
    interactionPoint: [-3.65, 2.5],
    interactions: [
      {
        label: "Sit & unwind",
        action: "Relaxing",
        duration: 7,
        effects: { energy: 12, fun: 8 },
        icon: "sofa",
      },
    ],
  },
  {
    id: "tv",
    name: "Little screen",
    kind: "tv",
    position: [-0.95, 2.6],
    size: [0.55, 1.9],
    interactionPoint: [-1.65, 2.6],
    interactions: [
      {
        label: "Watch TV",
        action: "Watching TV",
        duration: 9,
        effects: { fun: 35 },
        icon: "tv",
      },
    ],
  },
  {
    id: "coffee",
    name: "Coffee table",
    kind: "coffee",
    position: [-2.8, 2.7],
    size: [0.85, 1.35],
    interactions: [],
  },
  {
    id: "bed",
    name: "Cloud bed",
    kind: "bed",
    position: [-3.8, -3.2],
    size: [2.1, 2.9],
    interactionPoint: [-2.25, -2.7],
    interactions: [
      {
        label: "Take a nap",
        action: "Sleeping",
        duration: 12,
        effects: { energy: 45 },
        icon: "bed",
      },
    ],
  },
  {
    id: "nightstand",
    name: "Bedside table",
    kind: "nightstand",
    position: [-5.35, -3.7],
    size: [0.65, 0.7],
    interactions: [],
  },
  {
    id: "fridge",
    name: "Fresh fridge",
    kind: "fridge",
    position: [5, -4],
    size: [1.1, 1.3],
    interactionPoint: [5, -2.9],
    interactions: [
      {
        label: "Have a snack",
        action: "Eating",
        duration: 6,
        effects: { hunger: 35 },
        icon: "food",
      },
    ],
  },
  {
    id: "counter",
    name: "Kitchen counter",
    kind: "counter",
    position: [2.6, -4.45],
    size: [3.1, 0.85],
    interactions: [],
  },
  {
    id: "dining",
    name: "Dining table",
    kind: "dining",
    position: [2.8, -2.35],
    size: [1.7, 1],
    interactions: [],
  },
  {
    id: "chair",
    name: "Dining chair",
    kind: "chair",
    position: [2.8, -1.2],
    size: [0.65, 0.65],
    interactions: [],
  },
  {
    id: "toilet",
    name: "Porcelain throne",
    kind: "toilet",
    position: [1.25, 4],
    size: [0.75, 1.1],
    interactionPoint: [1.25, 2.95],
    interactions: [
      {
        label: "Use toilet",
        action: "Using toilet",
        duration: 5,
        effects: { hygiene: 12 },
        icon: "water",
      },
    ],
  },
  {
    id: "shower",
    name: "Rain shower",
    kind: "shower",
    position: [4.8, 3.85],
    size: [1.55, 1.6],
    interactionPoint: [4.8, 2.6],
    interactions: [
      {
        label: "Freshen up",
        action: "Showering",
        duration: 9,
        effects: { hygiene: 45 },
        icon: "water",
      },
    ],
  },
  {
    id: "sink",
    name: "Bathroom sink",
    kind: "sink",
    position: [3, 4.45],
    size: [1.2, 0.75],
    interactionPoint: [3, 3.55],
    interactions: [
      {
        label: "Wash hands",
        action: "Washing hands",
        duration: 4,
        effects: { hygiene: 15 },
        icon: "water",
      },
    ],
  },
];
export const walls = [
  { position: [0, -5] as Point, size: [12.15, 0.16] as Point, height: 2.4 },
  { position: [-6, 0] as Point, size: [0.16, 10] as Point, height: 2.4 },
  { position: [6, 0] as Point, size: [0.16, 10] as Point, height: 0.35 },
  { position: [0, 5] as Point, size: [12.15, 0.16] as Point, height: 0.35 },
  ...[
    [-4.45, 3.1],
    [-0.75, 1.5],
    [0.7, 1.4],
    [4.35, 3.3],
  ].map(([x, w]) => ({
    position: [x, 0] as Point,
    size: [w, 0.16] as Point,
    height: 0.7,
  })),
  ...[
    [-3.9, 2.2],
    [0, 1.5],
    [3.9, 2.2],
  ].map(([z, d]) => ({
    position: [0, z] as Point,
    size: [0.16, d] as Point,
    height: 0.7,
  })),
];
