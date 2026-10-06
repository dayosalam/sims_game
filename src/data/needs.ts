import type { Need } from "./objects";
export const needDefinitions: {
  id: Need;
  label: string;
  color: string;
  decay: number;
}[] = [
  { id: "hunger", label: "Hunger", color: "#d8a352", decay: 0.14 },
  { id: "energy", label: "Energy", color: "#81a770", decay: 0.09 },
  { id: "hygiene", label: "Hygiene", color: "#69a8b4", decay: 0.075 },
  { id: "fun", label: "Fun", color: "#b39bca", decay: 0.11 },
];
