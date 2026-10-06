import { walls, type Point } from "../data/objects";
import { useGameStore } from "../store/gameStore";
export function Box({
  position,
  size,
  color,
  ...props
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} {...props} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
function Room({
  center,
  size,
  color,
}: {
  center: Point;
  size: Point;
  color: string;
  label: string;
}) {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[center[0], 0.011, center[1]]}
        receiveShadow
        onClick={(e) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          if (e.delta < 5)
            useGameStore.getState().moveTo([e.point.x, e.point.z]);
        }}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
export function House() {
  return (
    <group>
      <Box position={[0, -0.22, 0]} size={[12.4, 0.42, 10.4]} color="#eadac1" />
      <Room center={[-3, -2.5]} size={[6, 5]} color="#e3c7a4" label="BEDROOM" />
      <Room center={[3, -2.5]} size={[6, 5]} color="#f0ddbd" label="KITCHEN" />
      <Room
        center={[-3, 2.5]}
        size={[6, 5]}
        color="#e5cbaa"
        label="LIVING ROOM"
      />
      <Room center={[3, 2.5]} size={[6, 5]} color="#bcd5cf" label="BATHROOM" />
      {Array.from({ length: 19 }, (_, i) => (
        <Box
          key={i}
          position={[-3, 0.018, -4.75 + i * 0.5]}
          size={[5.9, 0.006, 0.012]}
          color="#cfb290"
        />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <Box
          key={`tilex${i}`}
          position={[0.5 + i * 0.5, 0.02, 2.5]}
          size={[0.014, 0.006, 4.8]}
          color="#dae7df"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Box
          key={`tilez${i}`}
          position={[3, 0.02, 0.5 + i * 0.5]}
          size={[5.85, 0.006, 0.014]}
          color="#dae7df"
        />
      ))}
      {walls.map((w, i) => (
        <group key={i}>
          <Box
            position={[w.position[0], w.height / 2, w.position[1]]}
            size={[w.size[0], w.height, w.size[1]]}
            color={i === 1 ? "#e7e1cb" : "#f8f2dd"}
          />
          <Box
            position={[w.position[0], w.height + 0.02, w.position[1]]}
            size={[w.size[0] + 0.03, 0.06, w.size[1] + 0.03]}
            color="#fff8e7"
          />
        </group>
      ))}
      <Box position={[-3, 1.5, -4.9]} size={[1.7, 1.2, 0.05]} color="#fdfaf0" />
      <Box
        position={[-3, 1.5, -4.86]}
        size={[1.48, 0.98, 0.035]}
        color="#a6cbd0"
      />
      <Box
        position={[-3, 1.5, -4.81]}
        size={[0.045, 1, 0.045]}
        color="#fff8e7"
      />
      <Box
        position={[-3, 1.5, -4.81]}
        size={[1.5, 0.045, 0.045]}
        color="#fff8e7"
      />
      <Box
        position={[2.3, 1.6, -4.89]}
        size={[1.65, 1.15, 0.06]}
        color="#fffbec"
      />
      <Box
        position={[2.3, 1.6, -4.84]}
        size={[1.45, 0.95, 0.04]}
        color="#b1d2d1"
      />
      <Box
        position={[2.3, 1.6, -4.79]}
        size={[0.04, 0.95, 0.04]}
        color="#fff8e7"
      />
      <Box
        position={[-5.89, 1.55, 1.6]}
        size={[0.05, 0.9, 0.7]}
        color="#bd8960"
      />
      <Box
        position={[-5.85, 1.55, 1.6]}
        size={[0.04, 0.75, 0.55]}
        color="#f3d7aa"
      />
      <mesh position={[-3.2, 0.035, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.8]} />
        <meshStandardMaterial color="#faf0d7" />
      </mesh>
    </group>
  );
}
