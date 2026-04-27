import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function Seaweed({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 建立一撮（約 4~6 根）的隨機海草葉片
  const blades = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      x: (Math.random() - 0.5) * 0.6,
      z: (Math.random() - 0.5) * 0.6,
      scaleY: Math.random() * 1.5 + 1.2, // 海草高度（約 1.2 ~ 2.7）
      delay: Math.random() * Math.PI * 2, // 搖擺相位的隨機差，讓每根擺動不一樣
      color: ["#2d6a4f", "#1b4332", "#40916c"][Math.floor(Math.random() * 3)]
    }));
  }, []);

  // 創造一個「原點在底部」的圓柱體幾何（只要算一次，效能好）
  // 這樣旋轉時才會像草一樣從根部搖擺，而不是從正中間旋轉
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.06, 1, 5);
    geo.translate(0, 0.5, 0); // 往上推高一半，把中心點留在 0（也就是最底部）
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // 讓海草隨水流平緩搖擺
    groupRef.current.children.forEach((mesh, index) => {
      const blade = blades[index];
      // HMR 熱更新時，children 長度可能短暫與 blades 不同步而引發 undefined 崩潰 (白屏主因之一)
      if (!blade) return; 

      // 利用 sin 創造平滑來回擺動
      mesh.rotation.z = Math.sin(time * 0.8 + blade.delay) * 0.15;
      mesh.rotation.x = Math.cos(time * 0.6 + blade.delay) * 0.15;
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {blades.map((blade, i) => (
        <mesh 
          key={i} 
          position={[blade.x, 0, blade.z]} // Y 放 0，因為群組已經定位在地板了
          scale={[1, blade.scaleY, 1]}
          geometry={geometry}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={blade.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
