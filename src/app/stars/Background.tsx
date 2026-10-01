'use client';

import { Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useEffect, useRef, useState } from 'react';
import * as THREE from "three";
import s from "./Background.module.scss";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return prefersReducedMotion;
}

export default function CanvasBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return <div className={s.canvas} style={{
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Just to remove the textNodes from the element
    display: "flex"
  }}>
    <Canvas
      camera={{ position: [0, 0, -320] }}
      dpr={[1, 2]}
      frameloop={prefersReducedMotion ? 'demand' : 'always'}
    >
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={1} />
      <StarField paused={prefersReducedMotion} />
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <Vignette darkness={0.35} />
      </EffectComposer>
    </Canvas>
  </div>
}

function StarField({ paused }: { paused: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Track the cursor over the whole window (content sits above the canvas,
  // so canvas-local pointer events would miss most of the page).
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((_, delta) => {
    if (paused) {
      return;
    }

    if (meshRef.current) {
      // Rotate around an axis that's 45 degrees from vertical
      // This creates rotation parallel to the screen at 45 degrees
      const axis = new THREE.Vector3(1, 1, 1).normalize();
      meshRef.current.rotateOnAxis(axis, delta * 0.02);
    }

    if (groupRef.current) {
      // Ease the whole field toward a slight tilt opposite the cursor
      const targetX = pointer.current.y * 0.05;
      const targetY = pointer.current.x * 0.05;
      const ease = Math.min(delta * 2, 1);
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * ease;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * ease;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars ref={meshRef} depth={50} radius={80} saturation={0} count={400} speed={1} />
    </group>
  );
}