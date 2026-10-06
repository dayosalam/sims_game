import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, type RefObject } from "react";
import { MOUSE, Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { objects } from "../data/objects";
import { InteractionMenu } from "./InteractionMenu";
import { House } from "./House";
import { Character } from "./Character";
import { Furniture } from "./Furniture";
import { useGameStore } from "../store/gameStore";
function CameraController() {
  const ref = useRef<OrbitControlsType>(null);
  const keys = useRef(new Set<string>());
  const command = useGameStore((s) => s.cameraCommand);
  const { size, camera } = useThree();
  const baseZoom = Math.min(48, size.height / 14, size.width / 19);
  useEffect(() => {
    camera.zoom = baseZoom;
    camera.updateProjectionMatrix();
  }, [camera, baseZoom]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      if (
        e.target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) ||
          e.target.isContentEditable)
      )
        return;
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      ) {
        e.preventDefault();
        keys.current.add(e.key);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
  useEffect(() => {
    const c = ref.current;
    if (!c || !command) return;
    if (command.type === "reset") {
      c.target.set(0, 0, 0);
      c.object.position.set(14, 16, 18);
      if ("zoom" in c.object) c.object.zoom = baseZoom;
    } else if ("zoom" in c.object)
      c.object.zoom = Math.max(
        baseZoom * 0.6,
        Math.min(
          85,
          Number(c.object.zoom) * (command.type === "in" ? 1.15 : 1 / 1.15),
        ),
      );
    c.object.updateProjectionMatrix();
    c.update();
  }, [command, baseZoom]);
  useFrame((_, dt) => {
    const c = ref.current;
    if (!c) return;
    const k = keys.current;
    const x =
        Number(k.has("d") || k.has("ArrowRight")) -
        Number(k.has("a") || k.has("ArrowLeft")),
      z =
        Number(k.has("s") || k.has("ArrowDown")) -
        Number(k.has("w") || k.has("ArrowUp"));
    const shift = new Vector3(x + z, 0, z - x).multiplyScalar(dt * 3);
    c.target.add(shift);
    c.object.position.add(shift);
    const clamp = c.target.clone();
    clamp.x = Math.max(-4, Math.min(4, clamp.x));
    clamp.z = Math.max(-4, Math.min(4, clamp.z));
    clamp.y = 0;
    const offset = clamp.sub(c.target);
    c.target.add(offset);
    c.object.position.add(offset);
    c.update();
  });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableRotate={false}
      minZoom={baseZoom * 0.6}
      maxZoom={85}
      enableDamping
      dampingFactor={0.12}
      screenSpacePanning={false}
      mouseButtons={{ LEFT: undefined, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }}
    />
  );
}
function Simulation() {
  useFrame((_, dt) => useGameStore.getState().tick(dt));
  return null;
}
function Destination() {
  const destination = useGameStore((s) => s.destination),
    life = useGameStore((s) => s.markerLife);
  return destination && life > 0 ? (
    <mesh
      position={[destination[0], 0.055, destination[1]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.17, 0.23, 32]} />
      <meshBasicMaterial
        color="#397d65"
        transparent
        opacity={Math.min(life, 1)}
      />
    </mesh>
  ) : null;
}
function OverlayPositions({
  tag,
  menu,
}: {
  tag: RefObject<HTMLDivElement | null>;
  menu: RefObject<HTMLDivElement | null>;
}) {
  const point = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    const state = useGameStore.getState();
    const project = (x: number, y: number, z: number) => {
      point.current.set(x, y, z).project(camera);
      return [
        ((point.current.x + 1) * size.width) / 2,
        ((-point.current.y + 1) * size.height) / 2,
      ];
    };
    const [x, y] = project(state.position[0], 1.9, state.position[1]);
    if (tag.current) tag.current.style.transform = `translate(${x}px,${y}px)`;
    const object = objects.find((o) => o.id === state.selected);
    if (object && menu.current) {
      const [mx, my] = project(object.position[0], 1.8, object.position[1]);
      menu.current.style.transform = `translate(${Math.max(120, Math.min(size.width - 120, mx))}px,${Math.max(110, my)}px)`;
    }
  });
  return null;
}
export function GameCanvas() {
  const tag = useRef<HTMLDivElement>(null),
    menu = useRef<HTMLDivElement>(null);
  const selected = useGameStore((s) => s.selected),
    action = useGameStore((s) => (s.task?.started ? s.action : "Alex"));
  const object = objects.find((o) => o.id === selected);
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{ position: [14, 16, 18], zoom: 36, near: 0.1, far: 100 }}
        dpr={[1, 1.7]}
        onPointerMissed={() => useGameStore.getState().select(null)}
      >
        <ambientLight intensity={1.35} />
        <directionalLight
          position={[-3, 12, 6]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-normalBias={0.035}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.46, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial transparent opacity={0.12} />
        </mesh>
        <House />
        <Furniture />
        <Character />
        <Destination />
        <CameraController />
        <Simulation />
        <OverlayPositions tag={tag} menu={menu} />
      </Canvas>
      <div ref={tag} className="world-tag">
        <div className="character-tag">
          {action === "Sleeping" ? "☾ Z z z" : action}
        </div>
      </div>
      {object ? (
        <div ref={menu} className="world-menu">
          <InteractionMenu object={object} />
        </div>
      ) : null}
    </>
  );
}
