import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

type FishProps = {
  color?: string;
  type?: "goldfish" | "zebrafish" | "balloon";
};

const BASE_PATH = "/aquarium";

useGLTF.preload(`${BASE_PATH}/models/Goldfish.glb`);
useGLTF.preload(`${BASE_PATH}/models/Fish.glb`);
useGLTF.preload(`${BASE_PATH}/models/Blowfish.glb`);

export default function Fish({ type = "goldfish" }: FishProps) {
  const ref = useRef<THREE.Group>(null);
  
  const { scene: goldfishScene } = useGLTF(`${BASE_PATH}/models/Goldfish.glb`);
  const { scene: zebrafishScene } = useGLTF(`${BASE_PATH}/models/Fish.glb`);
  const { scene: balloonScene } = useGLTF(`${BASE_PATH}/models/Blowfish.glb`);

  const modelScene = useMemo(() => {
    if (type === "goldfish") return goldfishScene;
    if (type === "zebrafish") return zebrafishScene;
    return balloonScene;
  }, [type, goldfishScene, zebrafishScene, balloonScene]);

  const clonedScene = useMemo(() => SkeletonUtils.clone(modelScene), [modelScene]);

  const movement = useMemo(() => {
    switch(type) {
      case "goldfish": return { speed: 0.005, turnRate: 0.015, timeOffset: Math.random() * 100, scale: 0.01, rotation: [0, 0, 0] as [number, number, number] };
      case "zebrafish": return { speed: 0.012, turnRate: 0.04, timeOffset: Math.random() * 100, scale: 0.1, rotation: [0, 0, 0] as [number, number, number] };
      case "balloon": return { speed: 0.003, turnRate: 0.01, timeOffset: Math.random() * 100, scale: 0.05, rotation: [0, 0, 0] as [number, number, number] };
      default: return { speed: 0.005, turnRate: 0.02, timeOffset: Math.random() * 100, scale: 0.05, rotation: [0, 0, 0] as [number, number, number] };
    }
  }, [type]);

  const initialPos = useMemo(() => [
    (Math.random() - 0.5) * 2,
    Math.random() * 1.3 + 0.2,
    (Math.random() - 0.5) * 2,
  ] as [number, number, number], []);

  const direction = useRef(new THREE.Vector3(Math.random() - 0.5, (Math.random() - 0.5) * 0.2, Math.random() - 0.5).normalize());

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const sway = Math.sin(time * 3 + movement.timeOffset) * movement.turnRate;
    direction.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), sway);

    if (isNaN(direction.current.x) || direction.current.lengthSq() < 0.0001) {
      direction.current.set(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    }

    direction.current.normalize();
    ref.current.position.add(direction.current.clone().multiplyScalar(movement.speed));

    const limit = 1.8;
    if (Math.abs(ref.current.position.x) > limit) direction.current.x *= -1;
    if (Math.abs(ref.current.position.z) > limit) direction.current.z *= -1;
    if (ref.current.position.y > 1.5 || ref.current.position.y < 0.2) direction.current.y *= -1;

    const lookTarget = ref.current.position.clone().add(direction.current);
    ref.current.lookAt(lookTarget);
  });

  return (
    <group ref={ref} position={initialPos}>
      <primitive object={clonedScene} scale={movement.scale} rotation={movement.rotation} />
    </group>
  );
}
