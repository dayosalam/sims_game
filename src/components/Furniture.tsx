import { RoundedBox } from "@react-three/drei";
import { useState } from "react";
import { objects, type HomeObject } from "../data/objects";
import { useGameStore } from "../store/gameStore";
import { Box } from "./House";
function SoftBox({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <RoundedBox
      position={position}
      args={size}
      radius={0.07}
      smoothness={2}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.88} />
    </RoundedBox>
  );
}
function Cylinder({
  position,
  radius,
  height,
  color,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 20]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Legs({ x, z, height }: { x: number; z: number; height: number }) {
  return (
    <>
      {[-1, 1].flatMap((a) =>
        [-1, 1].map((b) => (
          <Box
            key={`${a}${b}`}
            position={[a * x, height / 2, b * z]}
            size={[0.09, height, 0.09]}
            color="#8a6548"
          />
        )),
      )}
    </>
  );
}
function Plant() {
  return (
    <>
      <Cylinder
        position={[0, 0.17, 0]}
        radius={0.18}
        height={0.34}
        color="#dca574"
      />
      {[-0.17, 0, 0.17].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.48 + 0.12 * (i % 2), 0]}
          rotation={[0, 0, -x * 3]}
          castShadow
        >
          <sphereGeometry args={[0.19, 6, 6]} />
          <meshStandardMaterial color={i % 2 ? "#678761" : "#8caa71"} />
        </mesh>
      ))}
    </>
  );
}
function Model({ kind }: { kind: string }) {
  switch (kind) {
    case "plant":
      return <Plant />;
    case "sofa":
      return (
        <>
          <SoftBox
            position={[0, 0.38, 0]}
            size={[1, 0.45, 2.65]}
            color="#6c9684"
          />
          <SoftBox
            position={[-0.38, 0.78, 0]}
            size={[0.28, 0.8, 2.7]}
            color="#729b88"
          />
          {[-0.85, 0, 0.85].map((z) => (
            <SoftBox
              key={z}
              position={[0.13, 0.65, z]}
              size={[0.75, 0.2, 0.8]}
              color="#95b4a0"
            />
          ))}
          {[-1.25, 1.25].map((z) => (
            <SoftBox
              key={z}
              position={[0, 0.74, z]}
              size={[1, 0.5, 0.2]}
              color="#729b88"
            />
          ))}
          <SoftBox
            position={[0.1, 0.84, -0.8]}
            size={[0.36, 0.4, 0.42]}
            color="#f0d9a4"
          />
          <SoftBox
            position={[0.1, 0.84, 0.85]}
            size={[0.36, 0.4, 0.42]}
            color="#e6c0a3"
          />
        </>
      );
    case "tv":
      return (
        <>
          <Box
            position={[0, 0.3, 0]}
            size={[0.55, 0.55, 1.9]}
            color="#b89063"
          />
          <Box
            position={[-0.02, 0.62, 0]}
            size={[0.6, 0.08, 2]}
            color="#ddbc88"
          />
          <Box position={[0, 1.1, 0]} size={[0.1, 0.86, 1.6]} color="#364849" />
          <Box
            position={[-0.062, 1.12, 0]}
            size={[0.015, 0.7, 1.42]}
            color="#729ca6"
          />
          <Box
            position={[-0.073, 1.02, 0.24]}
            size={[0.016, 0.24, 0.6]}
            color="#a0c1ae"
          />
          <Box
            position={[-0.073, 1.25, -0.35]}
            size={[0.016, 0.2, 0.3]}
            color="#f4d99c"
          />
        </>
      );
    case "coffee":
      return (
        <>
          <Legs x={0.29} z={0.5} height={0.38} />
          <SoftBox
            position={[0, 0.43, 0]}
            size={[0.85, 0.13, 1.35]}
            color="#b98659"
          />
          <Box
            position={[0, 0.52, 0.23]}
            size={[0.37, 0.05, 0.42]}
            color="#618388"
          />
          <Box
            position={[0.04, 0.56, 0.2]}
            size={[0.3, 0.03, 0.37]}
            color="#f0deb8"
          />
          <Cylinder
            position={[0, 0.59, -0.3]}
            radius={0.095}
            height={0.2}
            color="#faf1de"
          />
        </>
      );
    case "bed":
      return (
        <>
          <Box
            position={[0, 0.22, 0]}
            size={[2.1, 0.36, 2.9]}
            color="#b68c65"
          />
          <SoftBox
            position={[0, 0.49, 0]}
            size={[2, 0.34, 2.8]}
            color="#fffaed"
          />
          <SoftBox
            position={[0, 0.68, 0.4]}
            size={[2.03, 0.18, 1.92]}
            color="#9aacc2"
          />
          <Box
            position={[0, 0.8, -1.36]}
            size={[2.15, 1.25, 0.16]}
            color="#b99872"
          />
          {[-0.5, 0.5].map((x) => (
            <SoftBox
              key={x}
              position={[x, 0.74, -0.94]}
              size={[0.82, 0.2, 0.53]}
              color="#fff7e5"
            />
          ))}
          <Box
            position={[0, 0.79, 0.99]}
            size={[2.04, 0.06, 0.48]}
            color="#e9bd89"
          />
        </>
      );
    case "nightstand":
      return (
        <>
          <Box position={[0, 0.3, 0]} size={[0.65, 0.6, 0.7]} color="#b78b60" />
          <Box
            position={[0, 0.63, 0]}
            size={[0.72, 0.07, 0.76]}
            color="#dab78c"
          />
          <Cylinder
            position={[0, 0.77, 0]}
            radius={0.045}
            height={0.3}
            color="#957551"
          />
          <mesh position={[0, 1, 0]}>
            <coneGeometry args={[0.23, 0.3, 16]} />
            <meshStandardMaterial color="#ffebbc" />
          </mesh>
        </>
      );
    case "fridge":
      return (
        <>
          <SoftBox
            position={[0, 1.02, 0]}
            size={[1.08, 2.04, 1.25]}
            color="#e6efdc"
          />
          <Box
            position={[0, 1.46, 0.641]}
            size={[1, 0.025, 0.018]}
            color="#a4b7a2"
          />
          <Box
            position={[-0.36, 0.93, 0.69]}
            size={[0.045, 0.45, 0.08]}
            color="#8f9e8b"
          />
          <Box
            position={[-0.36, 1.7, 0.69]}
            size={[0.045, 0.25, 0.08]}
            color="#8f9e8b"
          />
          <Box
            position={[0.15, 1.26, 0.641]}
            size={[0.26, 0.3, 0.025]}
            color="#e6bc7c"
          />
        </>
      );
    case "counter":
      return (
        <>
          <Box
            position={[0, 0.47, 0]}
            size={[3.1, 0.9, 0.85]}
            color="#7f9a89"
          />
          <Box
            position={[0, 0.95, 0]}
            size={[3.2, 0.12, 0.98]}
            color="#faf2dc"
          />
          {[-1, 0, 1].map((x) => (
            <group key={x}>
              <Box
                position={[x, 0.45, 0.435]}
                size={[0.91, 0.8, 0.025]}
                color="#8eaa94"
              />
              <Box
                position={[x, 0.7, 0.47]}
                size={[0.28, 0.035, 0.04]}
                color="#e6dab6"
              />
            </group>
          ))}
          <Box
            position={[-0.7, 1.018, 0]}
            size={[0.85, 0.025, 0.6]}
            color="#48595a"
          />
          {[-0.9, -0.5].flatMap((x) =>
            [-0.18, 0.18].map((z) => (
              <Cylinder
                key={`${x}${z}`}
                position={[x, 1.04, z]}
                radius={0.13}
                height={0.015}
                color="#7c8984"
              />
            )),
          )}
          <group position={[0.9, 1.03, 0]}>
            <Plant />
          </group>
        </>
      );
    case "dining":
      return (
        <>
          <Legs x={0.65} z={0.33} height={0.85} />
          <SoftBox
            position={[0, 0.9, 0]}
            size={[1.7, 0.14, 1]}
            color="#d3ae76"
          />
          <Cylinder
            position={[0, 1.04, 0]}
            radius={0.22}
            height={0.12}
            color="#f6ead0"
          />
          <mesh position={[0, 1.14, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#d89a4d" />
          </mesh>
        </>
      );
    case "chair":
      return (
        <>
          <Legs x={0.23} z={0.23} height={0.47} />
          <SoftBox
            position={[0, 0.5, 0]}
            size={[0.65, 0.12, 0.65]}
            color="#ca9c65"
          />
          <Box
            position={[0, 0.8, 0.26]}
            size={[0.65, 0.58, 0.12]}
            color="#d6b078"
          />
        </>
      );
    case "toilet":
      return (
        <>
          <Cylinder
            position={[0, 0.23, 0]}
            radius={0.25}
            height={0.44}
            color="#f3f3e7"
          />
          <SoftBox
            position={[0, 0.5, -0.05]}
            size={[0.65, 0.24, 0.85]}
            color="#fffdf1"
          />
          <mesh position={[0, 0.63, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.065, 10, 24]} />
            <meshStandardMaterial color="#d9e3db" />
          </mesh>
          <SoftBox
            position={[0, 0.75, 0.4]}
            size={[0.68, 0.72, 0.24]}
            color="#f4f5e9"
          />
        </>
      );
    case "shower":
      return (
        <>
          <Box
            position={[0, 0.09, 0]}
            size={[1.55, 0.18, 1.6]}
            color="#f3f6ec"
          />
          <Box
            position={[0, 0.19, 0]}
            size={[1.35, 0.025, 1.4]}
            color="#d3e2d9"
          />
          <Box
            position={[0.68, 1.14, 0]}
            size={[0.045, 2.1, 1.5]}
            color="#b1cbc5"
          />
          <mesh position={[0, 1.14, 0.7]}>
            <boxGeometry args={[1.4, 2.1, 0.035]} />
            <meshStandardMaterial
              color="#bbdad4"
              transparent
              opacity={0.28}
              depthWrite={false}
            />
          </mesh>
          <Box
            position={[0.52, 1.38, 0]}
            size={[0.035, 1.35, 0.035]}
            color="#748f89"
          />
          <Box
            position={[0.25, 2.03, 0]}
            size={[0.58, 0.04, 0.04]}
            color="#748f89"
          />
          <Cylinder
            position={[-0.02, 2.01, 0]}
            radius={0.19}
            height={0.055}
            color="#879c95"
          />
        </>
      );
    case "sink":
      return (
        <>
          <Box
            position={[0, 0.42, 0]}
            size={[1.2, 0.8, 0.75]}
            color="#85a497"
          />
          <SoftBox
            position={[0, 0.86, 0]}
            size={[1.28, 0.17, 0.8]}
            color="#fcf7e9"
          />
          <Box
            position={[0, 0.951, 0]}
            size={[0.72, 0.025, 0.44]}
            color="#b5cac0"
          />
          <Box
            position={[0, 1.08, 0.27]}
            size={[0.045, 0.28, 0.045]}
            color="#7c958e"
          />
          <Box
            position={[0, 1.21, 0.18]}
            size={[0.045, 0.04, 0.23]}
            color="#7c958e"
          />
        </>
      );
    default:
      return null;
  }
}
function FurnitureObject({ object }: { object: HomeObject }) {
  const [hovered, setHovered] = useState(false);
  const selected = useGameStore((s) => s.selected === object.id);
  const interactive = object.interactions.length > 0;
  return (
    <group
      position={[object.position[0], 0, object.position[1]]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.button === 0 && e.delta < 5)
          useGameStore.getState().select(interactive ? object.id : null);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (interactive) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <Model kind={object.kind} />
      {(hovered || selected) && interactive ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <ringGeometry
            args={[
              Math.max(...object.size) / 2 + 0.1,
              Math.max(...object.size) / 2 + 0.15,
              48,
            ]}
          />
          <meshBasicMaterial color="#fff9d5" />
        </mesh>
      ) : null}
    </group>
  );
}
export function Furniture() {
  return (
    <>
      {objects.map((o) => (
        <FurnitureObject key={o.id} object={o} />
      ))}
    </>
  );
}
