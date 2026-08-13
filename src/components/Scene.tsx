"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Blob({
  position,
  color,
  speed,
  distort,
  scale,
  opacity,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + timeOffset;
    meshRef.current.position.x = initialPos.x + Math.sin(t * speed * 0.3) * 0.5;
    meshRef.current.position.y =
      initialPos.y + Math.cos(t * speed * 0.2) * 0.4;
    meshRef.current.position.z =
      initialPos.z + Math.sin(t * speed * 0.15) * 0.3;
    meshRef.current.rotation.x = t * 0.05;
    meshRef.current.rotation.y = t * 0.08;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        speed={speed}
        distort={distort}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#C08B7E" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#FAF7F2" />
        <Blob
          position={[-2.5, 1, -2]}
          color="#C08B7E"
          speed={1.5}
          distort={0.4}
          scale={1.8}
          opacity={0.7}
        />
        <Blob
          position={[2, -0.5, -3]}
          color="#C08B7E"
          speed={1.2}
          distort={0.35}
          scale={1.4}
          opacity={0.5}
        />
        <Blob
          position={[0, 0.5, -4]}
          color="#1C1917"
          speed={1}
          distort={0.3}
          scale={2}
          opacity={0.4}
        />
      </Canvas>
    </div>
  );
}
