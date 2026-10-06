import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../store/gameStore";
import { Box } from "./House";
export function Character() {
  const root = useRef<THREE.Group>(null),
    body = useRef<THREE.Group>(null),
    left = useRef<THREE.Group>(null),
    right = useRef<THREE.Group>(null),
    phase = useRef(0);
  useFrame((_, delta) => {
    const s = useGameStore.getState();
    phase.current += delta * s.speed * 9;
    if (root.current) {
      root.current.position.set(s.position[0], 0, s.position[1]);
      root.current.rotation.y = s.angle;
    }
    const stride = s.path.length ? Math.sin(phase.current) * 0.5 : 0;
    if (left.current) left.current.rotation.x = stride;
    if (right.current) right.current.rotation.x = -stride;
    if (body.current)
      body.current.position.y = s.path.length
        ? Math.abs(Math.sin(phase.current)) * 0.04
        : Math.sin(phase.current * 0.3) * 0.012;
  });
  return (
    <group ref={root}>
      <group ref={body}>
        <group ref={left} position={[-0.13, 0.48, 0]}>
          <Box
            position={[0, -0.2, 0]}
            size={[0.19, 0.4, 0.21]}
            color="#45565c"
          />
          <Box
            position={[0, -0.4, 0.05]}
            size={[0.21, 0.12, 0.32]}
            color="#f5f0df"
          />
        </group>
        <group ref={right} position={[0.13, 0.48, 0]}>
          <Box
            position={[0, -0.2, 0]}
            size={[0.19, 0.4, 0.21]}
            color="#45565c"
          />
          <Box
            position={[0, -0.4, 0.05]}
            size={[0.21, 0.12, 0.32]}
            color="#f5f0df"
          />
        </group>
        <Box position={[0, 0.72, 0]} size={[0.5, 0.52, 0.3]} color="#d99159" />
        <Box
          position={[-0.32, 0.67, 0]}
          size={[0.14, 0.45, 0.17]}
          color="#c98f67"
        />
        <Box
          position={[0.32, 0.67, 0]}
          size={[0.14, 0.45, 0.17]}
          color="#c98f67"
        />
        <mesh position={[0, 1.16, 0]} castShadow>
          <sphereGeometry args={[0.26, 12, 10]} />
          <meshStandardMaterial color="#d49b75" />
        </mesh>
        <mesh position={[0, 1.29, -0.04]} castShadow>
          <sphereGeometry
            args={[0.265, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62]}
          />
          <meshStandardMaterial color="#433b34" />
        </mesh>
        <Box
          position={[-0.09, 1.17, 0.23]}
          size={[0.045, 0.04, 0.02]}
          color="#3d342d"
        />
        <Box
          position={[0.09, 1.17, 0.23]}
          size={[0.045, 0.04, 0.02]}
          color="#3d342d"
        />
      </group>
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.39, 40]} />
        <meshBasicMaterial color="#fafdf2" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}
