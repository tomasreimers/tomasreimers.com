'use client';

import { Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from "three";
import s from "./Background.module.scss";

export default function CanvasBackground() {

  return <div className={s.canvas} style={{
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Just to remove the textNodes from the element
    display: "flex"
  }}>
    <Canvas camera={{ position: [0, 0, -320] }} dpr={2}>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={1} />
      <StarField />
      <EffectComposer>
        <Vignette darkness={0.2} />
      </EffectComposer>
    </Canvas>
  </div>
}

function StarField() {
  const meshRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Rotate around an axis that's 45 degrees from vertical
      // This creates rotation parallel to the screen at 45 degrees
      const axis = new THREE.Vector3(1, 1, 1).normalize();
      meshRef.current.rotateOnAxis(axis, delta * 0.02);
    }
  });


  return <Stars ref={meshRef} depth={50} radius={80} saturation={0} count={400} speed={1} />
}