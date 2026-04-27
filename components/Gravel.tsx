import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export default function Gravel({ count = 1000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // 為了效能，採用 InstancedMesh 來繪製碎石
  // 所有石頭共用同一個極低面數的 12 面體幾何以及材質，在底層只需呼叫 1 次繪圖指令
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(0.04, 0), []);
  
  // 淺土色/米灰色的黑土底沙材質
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#a89f91", 
    roughness: 1, 
    metalness: 0 
  }), []);

  useEffect(() => {
    if (!meshRef.current) return;
    
    const dummy = new THREE.Object3D();
    
    // 透過迴圈分配這 1000 顆小碎石的隨機位置、大小與角度
    for (let i = 0; i < count; i++) {
        // 集中撒在長寬約 5.5 x 5.5 的中央水槽區域
      const x = (Math.random() - 0.5) * 5.5;
      const z = (Math.random() - 0.5) * 5.5;
      // y 軸高度貼近地板 (-1)，只做極微小的高低起伏
      const y = -0.99 + (Math.random() * 0.04);

      dummy.position.set(x, y, z);
      
      // 隨機翻滾角度，讓每顆鵝卵石看起來都不一樣
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // 讓碎石有不同的大小顆粒
      const scale = Math.random() * 0.6 + 0.5;
      // Y 軸稍微壓扁一點點，讓它更像扁平的底沙
      dummy.scale.set(scale, scale * 0.7, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    // 告訴 Three.js 更新所有的實例矩陣位置
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      receiveShadow
      // 小碎石面積太小，不用讓它們產生互相遮擋的影子以節省效能，只接受大石頭與魚的影子即可
    />
  );
}
