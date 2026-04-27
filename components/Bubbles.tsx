import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Bubbles({ count = 30, position = [0, -1, 0] }: { count?: number, position?: [number, number, number] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // 初始化每顆氣泡的獨特基因 (偏移位置、上升速度、扭動頻率)
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 0.3, // 氣泡會集中在源頭附近
      y: Math.random() * 6.0,         // 初始高度必須拉開，讓整條軌跡都有氣泡
      z: (Math.random() - 0.5) * 0.3,
      speed: Math.random() * 0.01 + 0.015, // 上升的基礎速度
      factor: Math.random() * 100,    // 正弦波扭動的隨機偏移量
      scale: Math.random() * 0.6 + 0.4 // 氣泡大小落差
    }));
  }, [count]);

  // 共用一顆極低面目的圓球體與半透明材質 (效能極佳)
  const geometry = useMemo(() => new THREE.SphereGeometry(0.025, 8, 8), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#ffffff", 
    transparent: true, 
    opacity: 0.3, // 改用最單純的透明度
    roughness: 0,
    metalness: 0.5
  }), []);

  // 用來代換空間矩陣的虛擬 3D 物件
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // 取出經過的時間 (用來做 sin 波浪計算)
    const time = state.clock.getElapsedTime();

    particles.forEach((particle, index) => {
      // 1. 每幀向上攀升
      particle.y += particle.speed;
      
      // 2. 將氣泡消失的高度拉到視角邊界外 (Y > 6)，確保它們一定是從畫面最上方離開
      if (particle.y > 6.0) {
        particle.y = 0;
        // 重新隨機分派起點，讓泡沫源頭看起來很自然
        particle.x = (Math.random() - 0.5) * 0.3;
        particle.z = (Math.random() - 0.5) * 0.3;
      }

      // 3. 加上 X 與 Z 軸的 sin/cos 微幅搖擺，模擬水中的氣泡浮力抖動
      const xOffset = Math.sin(time * 3 + particle.factor) * 0.04;
      const zOffset = Math.cos(time * 3 + particle.factor) * 0.04;

      // 把算好的位置寫進假物件
      dummy.position.set(particle.x + xOffset, particle.y, particle.z + zOffset);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();

      // 將該物件的變換矩陣一次性塞給 InstancedMesh
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    // 每一幀都告訴顯示卡：這批氣泡的矩陣更新了，請重畫！
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // 套用整個氣泡群組的絕對位置 (可以當作是在放打氣石)
    <group position={position}>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    </group>
  );
}
