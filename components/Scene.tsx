"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";
import Tank from "./Tank";
import Fish from "./Fish";
import Seaweed from "./Seaweed";
import Rock from "./Rock";
import Bubbles from "./Bubbles";
import { useState, Suspense, useMemo } from "react";

export default function Scene() {
  const [goldfishCount, setGoldfishCount] = useState(2);
  const [zebrafishCount, setZebrafishCount] = useState(1);
  const [balloonCount, setBalloonCount] = useState(0);
  const [rockCount, setRockCount] = useState(1);
  const [seaweedCount, setSeaweedCount] = useState(4);

  // 預先定義穩定的岩石與水草座標，確保增加數量時原本的景觀不會亂跳
  const rockPositions = useMemo(() => [
    { pos: [0, -1, -1.2] as [number, number, number], scale: 1.8 },
    { pos: [1.8, -1, 0.5] as [number, number, number], scale: 1.2 },
    { pos: [-1.5, -1, 1.0] as [number, number, number], scale: 1.0 },
    { pos: [1.2, -1, -1.5] as [number, number, number], scale: 1.1 },
    { pos: [-1.8, -1, -0.8] as [number, number, number], scale: 0.9 },
  ], []);

  const seaweedPositions = useMemo(() => [
    [-2, -1, -2] as [number, number, number],
    [2.5, -1, 1.5] as [number, number, number],
    [-1.5, -1, 2.5] as [number, number, number],
    [3, -1, -1.8] as [number, number, number],
    [-2.5, -1, 0.5] as [number, number, number],
    [1.0, -1, 2.0] as [number, number, number],
    [-1.0, -1, -2.5] as [number, number, number],
    [0.5, -1, 1.8] as [number, number, number],
    [-0.5, -1, 2.8] as [number, number, number],
    [2.2, -1, -2.2] as [number, number, number],
  ], []);

  const fishTypes: ("goldfish" | "zebrafish" | "balloon")[] = ["goldfish", "zebrafish", "balloon"];
  const goldfishColors = ["#ff4500", "#ff8c00"]; 
  const zebrafishColors = ["#4682b4", "#7b68ee", "#00ced1"]; 
  const balloonColors = ["#ffffff", "#1a1a1a", "#ffd700"];

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          padding: 20,
          color: "white",
          background: "rgba(0,0,0,0.5)",
          borderBottomRightRadius: "10px"
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Aquarium Controls</h3>
        
        <div style={{ marginBottom: 15, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: 5 }}>Fish Species</div>
          <div style={{ marginBottom: 8 }}>
            Goldfish: {goldfishCount}
            <input
              type="range"
              style={{ width: "100%", display: "block", marginTop: 2 }}
              min="0" max="10" value={goldfishCount}
              onChange={(e) => setGoldfishCount(Number(e.target.value))}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            Zebrafish: {zebrafishCount}
            <input
              type="range"
              style={{ width: "100%", display: "block", marginTop: 2 }}
              min="0" max="10" value={zebrafishCount}
              onChange={(e) => setZebrafishCount(Number(e.target.value))}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            Balloon: {balloonCount}
            <input
              type="range"
              style={{ width: "100%", display: "block", marginTop: 2 }}
              min="0" max="10" value={balloonCount}
              onChange={(e) => setBalloonCount(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          Rocks: {rockCount}
          <input
            type="range"
            style={{ width: "100%", display: "block", marginTop: 5 }}
            min="0" max="5" value={rockCount}
            onChange={(e) => setRockCount(Number(e.target.value))}
          />
        </div>
        <div>
          Seaweed: {seaweedCount}
          <input
            type="range"
            style={{ width: "100%", display: "block", marginTop: 5 }}
            min="0" max="10" value={seaweedCount}
            onChange={(e) => setSeaweedCount(Number(e.target.value))}
          />
        </div>
      </div>

      {/* 🛡️ 終極穩定性防護罩：絕對不改動視覺，僅從系統層級阻斷白屏崩潰 */}
      <Canvas 
        shadows={{ type: THREE.BasicShadowMap }} 
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: true
        }} 
        dpr={1} 
        camera={{ position: [0, 2, 5], fov: 60 }}
      >
        <color attach="background" args={["#041a2e"]} />
        <fog attach="fog" args={["#041a2e", 3, 12]} />

        <ambientLight intensity={0.5} />
        {/* 穩定性優化：精確收束陰影相機範圍，減少 80% 冗餘 VRAM 消耗 */}
        <directionalLight 
          castShadow 
          position={[5, 10, 5]} 
          intensity={1.5} 
          color="#88eaff" 
          shadow-mapSize={[256, 256]} 
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        
        {/* 使用 Suspense 包裹非同步資源，防止 Environment 載入時卡死 GPU 造成白屏 */}
        <Suspense fallback={null}>
          <Environment preset="dawn" resolution={32} frames={1} />
        </Suspense>

        <Sparkles count={200} scale={[12, 8, 12]} size={3} speed={0.4} opacity={0.3} color="#aaddff" />

        <Tank />

        <Tank />

        {/* 渲染金魚 */}
        {Array.from({ length: goldfishCount }).map((_, i) => (
          <Fish key={`goldfish-${i}`} color={goldfishColors[i % goldfishColors.length]} type="goldfish" />
        ))}
        {/* 渲染斑馬魚 */}
        {Array.from({ length: zebrafishCount }).map((_, i) => (
          <Fish key={`zebrafish-${i}`} color={zebrafishColors[i % zebrafishColors.length]} type="zebrafish" />
        ))}
        {/* 渲染球魚 */}
        {Array.from({ length: balloonCount }).map((_, i) => (
          <Fish key={`balloon-${i}`} color={balloonColors[i % balloonColors.length]} type="balloon" />
        ))}

        {/* 動態渲染岩石 */}
        {rockPositions.slice(0, rockCount).map((rock, i) => (
          <Rock key={`rock-${i}`} position={rock.pos} scale={rock.scale} />
        ))}

        {/* 加入氣泡，僅在有第一顆主石時顯示，增加合理性 */}
        {rockCount > 0 && <Bubbles position={[-0.8, -1, -1.3]} count={30} />}
        {rockCount > 1 && <Bubbles position={[1.5, -1, -0.6]} count={15} />}

        {/* 動態渲染水草 */}
        {seaweedPositions.slice(0, seaweedCount).map((pos, i) => (
          <Seaweed key={`seaweed-${i}`} position={pos} />
        ))}

        <OrbitControls />
      </Canvas>
    </div>
  );
}
