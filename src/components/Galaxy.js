"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

function Stars({ data, onSelect }) {
  const ref = useRef();
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(data.length * 3);
    const col = new Float32Array(data.length * 3);
    data.forEach((item, i) => {
      pos.set(item.position, i * 3);
      const color = new THREE.Color(item.faded ? "#111111" : item.color);
      col.set([color.r, color.g, color.b], i * 3);
    });
    return [pos, col];
  }, [data]);

  useFrame((state) => {
    ref.current.rotation.y += 0.0003;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
  });

  return (
    <Points 
      ref={ref} 
      positions={positions} 
      colors={colors} 
      stride={3} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data[e.index]);
      }}
    >
      <PointMaterial transparent vertexColors size={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

export default function Galaxy({ data, onSelect }) {
  return (
    <div className="h-[600px] w-full bg-black rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl cursor-crosshair">
      <Canvas camera={{ position: [0, 0, 120], fov: 60 }} gl={{ preserveDrawingBuffer: true, antialias: false }}>
        <color attach="background" args={["#010103"]} />
        <Stars data={data} onSelect={onSelect} />
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} mipmapBlur />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute bottom-6 left-8 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Neural Map Mode // Local Render</div>
    </div>
  );
}