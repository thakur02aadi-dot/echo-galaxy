"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Stars({ data }) {
  const ref = useRef();
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(data.length * 3);
    const col = new Float32Array(data.length * 3);
    data.forEach((item, i) => {
      pos.set(item.position, i * 3);
      const color = new THREE.Color(item.color);
      col.set([color.r, color.g, color.b], i * 3);
    });
    return [pos, col];
  }, [data]);

  useFrame(() => (ref.current.rotation.y += 0.0005));

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial transparent vertexColors size={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

export default function Galaxy({ data }) {
  return (
    <div className="h-[500px] w-full bg-black rounded-2xl border border-zinc-800 overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 100] }}>
        <color attach="background" args={["#030303"]} />
        <Stars data={data} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-[10px] text-zinc-500 uppercase tracking-widest">3D Render Active • Drag to Explore</div>
    </div>
  );
}