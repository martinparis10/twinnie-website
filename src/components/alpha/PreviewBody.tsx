"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useRef, useEffect } from "react";
import type { OrbitControls as Controls } from "three-stdlib";
import { Vector3 } from "three";

function Body() {
  const material = <meshStandardMaterial color="#c9b8a5" roughness={0.82} />;
  return (
    <group position={[0, -0.95, 0]}>
      <mesh position={[0, 1.78, 0]} scale={[0.13, 0.18, 0.13]}>
        <sphereGeometry args={[1, 32, 24]} />
        {material}
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.12, 24]} />
        {material}
      </mesh>
      <mesh position={[0, 1.28, 0]} scale={[0.24, 0.31, 0.12]}>
        <sphereGeometry args={[1, 32, 24]} />
        {material}
      </mesh>
      <mesh position={[0, 0.96, 0]} scale={[0.19, 0.18, 0.12]}>
        <sphereGeometry args={[1, 32, 24]} />
        {material}
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.28, 1.26, 0]} rotation={[0, 0, s * 0.22]}>
            <capsuleGeometry args={[0.065, 0.35, 8, 20]} />
            {material}
          </mesh>
          <mesh position={[s * 0.35, 0.94, 0]} rotation={[0, 0, s * 0.12]}>
            <capsuleGeometry args={[0.045, 0.25, 8, 20]} />
            {material}
          </mesh>
          <mesh position={[s * 0.37, 0.72, 0]} scale={[0.045, 0.09, 0.025]}>
            <sphereGeometry args={[1, 24, 16]} />
            {material}
          </mesh>
          <mesh position={[s * 0.11, 0.66, 0]}>
            <capsuleGeometry args={[0.085, 0.34, 8, 20]} />
            {material}
          </mesh>
          <mesh position={[s * 0.12, 0.28, 0]}>
            <capsuleGeometry args={[0.058, 0.31, 8, 20]} />
            {material}
          </mesh>
          <mesh position={[s * 0.12, 0.03, 0.05]} scale={[0.065, 0.05, 0.14]}>
            <sphereGeometry args={[1, 24, 16]} />
            {material}
          </mesh>
        </group>
      ))}
    </group>
  );
}
function CameraControls({
  angle,
  zoom,
  reset,
}: {
  angle: number;
  zoom: number;
  reset: number;
}) {
  const ref = useRef<Controls>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const d = 3.8 / zoom;
    c.object.position.set(Math.sin(angle) * d, 0.12, Math.cos(angle) * d);
    c.target.copy(new Vector3(0, 0, 0));
    c.update();
  }, [angle, zoom, reset]);
  return (
    <OrbitControls
      ref={ref}
      enablePan={false}
      minDistance={1.8}
      maxDistance={5}
      minPolarAngle={0.6}
      maxPolarAngle={2.4}
    />
  );
}
export default function PreviewBody(props: {
  angle: number;
  zoom: number;
  reset: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.12, 3.8], fov: 36 }}
      dpr={[1, 1.5]}
      fallback={
        <p>
          3D preview unavailable on this device. You can still review the
          garment controls.
        </p>
      }
    >
      <color attach="background" args={["#FAF7F2"]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <Body />
      <ContactShadows
        position={[0, -0.97, 0]}
        opacity={0.22}
        scale={5}
        blur={2.5}
        far={3}
      />
      <CameraControls {...props} />
    </Canvas>
  );
}
