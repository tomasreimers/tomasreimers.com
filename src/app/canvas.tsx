"use client";

import { colord } from "colord";
import { useCallback, useEffect, useRef } from "react";

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
    display: "flex"
  }}>
    <canvas ref={canvasRef} />
  </div>
}

const PERCENT_STARS = 0.0004;
const SHOOTING_STARS_PER_SECOND = 1;
const STAR_COLORS = [
  '#f8fafc',
  // '#fee2e2',
  // '#ffedd5',
  // '#fef3c7',
  // '#fef9c3',
  // '#e0f2fe'
];
const BACKGROUND_FADE = 10;

class Animator {
  private callback: number | null = null;
  private subscribed = false;
  private start: number;
  private lastFrame: number;

  private stars: {
    x: number;
    y: number;
    size: number;
    color: string;
    brightness: {
      min: number;
      max: number;
      period: number;
      offset: number;
      initialFade: {
        duration: number;
        offset: number;
      };
    }
  }[] = [];

  private shootingStars: {
    start: number;
    startX: number;
    startY: number;
    life: number;
    angle: number;
    size: number;
    velocity: number;
    color: string;
  }[] = [];

  constructor(private canvas: HTMLCanvasElement, private pixelRatio: number) {
    const numberOfStars = (canvas.width / pixelRatio) * (canvas.height / pixelRatio) * PERCENT_STARS;

    for (let i = 0; i < numberOfStars; i++) {
      const x = Math.random() * (canvas.width / pixelRatio);
      const y = Math.random() * (canvas.height / pixelRatio);
      const size = 0.25 + Math.random() * 1.25;
      const brightness1 = Math.random();
      const brightness2 = Math.random();
      const period = 10 + Math.random() * 10;
      const initialFadeDuration = Math.random() * 30;
      const initialFadeOffset = Math.random() * 30;
      const offset = Math.random() * 20;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

      this.stars.push({
        x, 
        y, 
        size, 
        color,
        brightness: {
          min: Math.min(brightness1, brightness2),
          max: Math.max(brightness1, brightness2),
          period,
          offset,
          initialFade: {
            duration: initialFadeDuration,
            offset: initialFadeOffset
          }
        }
      });
    }

    this.start = (document.timeline.currentTime as number) || 0;
    this.lastFrame = this.start;

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.paintFrame = this.paintFrame.bind(this);
  }

  public paintFrame(time: DOMHighResTimeStamp) {
    const context = this.canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio || 1;

    this.computeShootingStars(time);

    if (context) {
      // Older versions of safari are missing this
      if ("reset" in context) {
        context.reset();
      }
  
      context.scale(pixelRatio, pixelRatio);
      this.paintSky(context, time);
      this.paintStars(context, time);
      this.paintShootingStars(context, time);
      context.resetTransform();
    }

    this.lastFrame = time;

    if (this.subscribed) {
      this.callback = requestAnimationFrame(this.paintFrame);
    }
  }

  private computeShootingStars(time: DOMHighResTimeStamp) {
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    this.shootingStars = this.shootingStars.filter(star => star.start + star.life * 1000 >= time);

    const timeSinceLastFrame = (time - this.lastFrame) / 1000;

    const shouldAddStar = Math.random() > 1 - (SHOOTING_STARS_PER_SECOND * timeSinceLastFrame);
    if (shouldAddStar) {
      const startX = Math.random() * (this.canvas.width / this.pixelRatio);
      const startY = Math.random() * (this.canvas.height / this.pixelRatio);
      const size = 0.25 + Math.random() * 1.25;
      const angle = Math.random() * Math.PI * 2;
      const life = 0.5 + Math.random() * 1.5;
      const velocity = 80 + Math.random() * 80;

      this.shootingStars.push({
        startX, 
        startY, 
        size, 
        start: time,
        life, 
        color,
        angle, 
        velocity
      });
    }
  }

  private paintSky(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) {
    ctx.save();

    const secondsSinceStart = (time - this.start) / 1000;
    const opacity = Math.max(0, secondsSinceStart / BACKGROUND_FADE);

    var gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, colord("#020617").alpha(opacity).toRgbString());
    gradient.addColorStop(1, colord("#0f172a").alpha(opacity).toRgbString());
  
    ctx.rect(0, 0, this.canvas.width / this.pixelRatio, this.canvas.height / this.pixelRatio);
    ctx.fillStyle = "#020617";
    ctx.fill();
    ctx.fillStyle = gradient;
    ctx.fill(); 
  
    ctx.restore();
  }

  private paintStars(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) {
    ctx.save();
  
    for (let i = 0; i < this.stars.length; i++) {
      const {
        x, 
        y, 
        size, 
        brightness: {
          min: brightnessMin, 
          max: brightnessMax, 
          period: brightnessPeriod,
          offset: brightnessOffset,
          initialFade: {
            duration: initialFadeDuration,
            offset: initialFadeOffset
          }
        }
      } = this.stars[i];
      
      const secondsSinceStart = (time - this.start) / 1000;
      const initialFadePercent = Math.min(1, Math.max(0, (secondsSinceStart - initialFadeOffset) / initialFadeDuration));
      const percentDone = (secondsSinceStart / brightnessPeriod) + brightnessOffset;
      const brightness = brightnessMin + brightnessMax * ((Math.sin(percentDone * 2 * Math.PI) + 1) / 2);
  
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = colord('#f8fafc').alpha(brightness * initialFadePercent).toRgbString();
      ctx.fill();
    }
  
    ctx.restore();
  }

  private paintShootingStars(ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) {
    ctx.save();
  
    for (let i = 0; i < this.shootingStars.length; i++) {
      const {
        startX, 
        startY, 
        size, 
        velocity, 
        life, 
        start, 
        angle
      } = this.shootingStars[i];

      const x = startX + Math.sin(angle) * velocity * ((time - start) / 1000);
      const y = startY + Math.cos(angle) * velocity * ((time - start) / 1000);
      
      const secondsSinceStart = (time - start) / 1000;
      const percentDone = (secondsSinceStart / life);
      const brightness = secondsSinceStart > life ? 0 : ((Math.sin(percentDone * Math.PI)));
  
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = colord('#f8fafc').alpha(brightness).toRgbString();
      ctx.fill();
    }
  
    ctx.restore();
  }

  public subscribe() {
    this.subscribed = true;
    this.callback = requestAnimationFrame(this.paintFrame);
  }

  public unsubscribe() {
    this.subscribed = false;
    if (this.callback){
      cancelAnimationFrame(this.callback);
    }
  }
}