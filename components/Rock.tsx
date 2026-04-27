import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function Rock({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // 隨機生成 3 塊有稜角的石頭，拼湊成一座「青龍石」主峰與附屬岩石
  // 考慮到剛剛的顯示卡效能瓶頸，我們將石頭數量嚴格控制在 3 塊，並固定數量以避免任何運算突波
  const rockPieces = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i) => ({
      // 第一塊做為主峰，第二、三塊作為基座旁的附屬石
      x: i === 0 ? 0 : (Math.random() - 0.5) * 0.8,
      y: i === 0 ? 0.3 : Math.random() * 0.2,
      z: i === 0 ? 0 : (Math.random() - 0.5) * 0.8,
      // 主峰長得挺拔俊俏，附屬石平緩
      scaleX: i === 0 ? 1 : Math.random() * 0.5 + 0.3,
      scaleY: i === 0 ? 1.5 : (Math.random() * 0.6 + 0.4), 
      scaleZ: i === 0 ? 1 : Math.random() * 0.5 + 0.3,
      // 隨機旋轉創造出不規則的銳利岩石斷面
      rotationX: Math.random() * Math.PI,
      rotationY: Math.random() * Math.PI,
      rotationZ: Math.random() * Math.PI,
      // 青龍石特徵：深灰帶有點微弱的藍/綠色調
      color: ["#4a5568", "#5a6678", "#3f4857"][i]
    }));
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {rockPieces.map((piece, i) => (
        <mesh 
          key={i} 
          position={[piece.x, piece.y, piece.z]} 
          rotation={[piece.rotationX, piece.rotationY, piece.rotationZ]}
          scale={[piece.scaleX, piece.scaleY, piece.scaleZ]}
          castShadow
          receiveShadow
        >
          {/* 使用最純粹、內建就有銳利稜角的十二面體 (dodecahedronGeometry) */}
          {/* 刻意不開啟 flatShading，確保在任何舊型顯示設備上都能 0 負載流暢渲染 */}
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color={piece.color} 
            roughness={0.9} 
            metalness={0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}
