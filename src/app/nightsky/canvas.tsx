"use client";

import { useCallback, useEffect, useRef } from "react";
import { Animator } from "./animator";

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const animator = useRef<Animator | null>(null);

  const resizeHandler = useCallback(() => {
    if (canvasRef.current && holderRef.current) {
      const pixelRatio = window.devicePixelRatio || 1;

      canvasRef.current.width = holderRef.current.clientWidth * pixelRatio;
      canvasRef.current.height = holderRef.current.clientHeight * pixelRatio;

      canvasRef.current.style.width = holderRef.current.clientWidth + "px";
      canvasRef.current.style.height = holderRef.current.clientHeight + "px";

      if (animator.current) {
        animator.current.unsubscribe();
      }

      const newAnimator = new Animator(canvasRef.current, pixelRatio);
      newAnimator.subscribe();
      animator.current = newAnimator;
    }
  }, []);

  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  }, []);

  return <div ref={holderRef} style={{
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Just to remove the textNodes from the element
    display: "flex"
  }}>
    <canvas ref={canvasRef} />
  </div>
}
