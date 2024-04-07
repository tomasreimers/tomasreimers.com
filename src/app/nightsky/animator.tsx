import { colord } from "colord";
import { BACKGROUND_FADE_IN_SECONDS, DARK_SKY_COLOR, LIGHT_SKY_COLOR, PERCENT_STARS, SHOOTING_STARS_PER_SECOND, STAR_COLORS } from "./config";

export class Animator {
  private paintNextFrameCallback: number | null = null;
  private subscribed = false;

  private startTime: number;
  private lastFrameTime: number;

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

  private height: number;
  private width: number;

  constructor(private canvas: HTMLCanvasElement, private pixelRatio: number) {
    this.height = canvas.height / pixelRatio;
    this.width = canvas.width / pixelRatio;

    const numberOfStars = (this.width) * (this.height) * PERCENT_STARS;

    for (let i = 0; i < numberOfStars; i++) {
      const x = Math.random() * (this.width);
      const y = Math.random() * (this.height);
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

    this.startTime = (document.timeline.currentTime as number) || 0;
    this.lastFrameTime = this.startTime;

    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.paintFrame = this.paintFrame.bind(this);
  }

  public paintFrame(time: DOMHighResTimeStamp) {
    const context = this.canvas.getContext("2d");

    this.computeShootingStars(time);

    if (context) {
      // Older versions of safari are missing this
      if ("reset" in context) {
        context.reset();
      }
  
      context.scale(this.pixelRatio, this.pixelRatio);
      this.paintSky(context, time);
      this.paintStars(context, time);
      this.paintShootingStars(context, time);
      context.resetTransform();
    }

    this.lastFrameTime = time;

    if (this.subscribed) {
      this.paintNextFrameCallback = requestAnimationFrame(this.paintFrame);
    }
  }

  private computeShootingStars(time: DOMHighResTimeStamp) {
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    this.shootingStars = this.shootingStars.filter(star => star.start + star.life * 1000 >= time);

    const timeSinceLastFrame = (time - this.lastFrameTime) / 1000;

    const shouldAddStar = Math.random() > 1 - (SHOOTING_STARS_PER_SECOND * timeSinceLastFrame);
    if (shouldAddStar) {
      const startX = Math.random() * (this.width);
      const startY = Math.random() * (this.height);
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

    const secondsSinceStart = (time - this.startTime) / 1000;
    const opacity = Math.max(0, secondsSinceStart / BACKGROUND_FADE_IN_SECONDS);

    var gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, colord(DARK_SKY_COLOR).alpha(opacity).toRgbString());
    gradient.addColorStop(1, colord(LIGHT_SKY_COLOR).alpha(opacity).toRgbString());
  
    ctx.rect(0, 0, this.width, this.height);
    ctx.fillStyle = DARK_SKY_COLOR;
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
        color,
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
      
      const secondsSinceStart = (time - this.startTime) / 1000;
      const initialFadePercent = Math.min(1, Math.max(0, (secondsSinceStart - initialFadeOffset) / initialFadeDuration));
      const percentDone = (secondsSinceStart / brightnessPeriod) + brightnessOffset;
      const brightness = brightnessMin + brightnessMax * ((Math.sin(percentDone * 2 * Math.PI) + 1) / 2);
  
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = colord(color).alpha(brightness * initialFadePercent).toRgbString();
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
        angle, 
        color
      } = this.shootingStars[i];

      const x = startX + Math.sin(angle) * velocity * ((time - start) / 1000);
      const y = startY + Math.cos(angle) * velocity * ((time - start) / 1000);
      
      const secondsSinceStart = (time - start) / 1000;
      const percentDone = (secondsSinceStart / life);
      const brightness = secondsSinceStart > life ? 0 : ((Math.sin(percentDone * Math.PI)));
  
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = colord(color).alpha(brightness).toRgbString();
      ctx.fill();
    }
  
    ctx.restore();
  }

  public subscribe() {
    this.subscribed = true;
    this.paintNextFrameCallback = requestAnimationFrame(this.paintFrame);
  }

  public unsubscribe() {
    this.subscribed = false;
    if (this.paintNextFrameCallback){
      cancelAnimationFrame(this.paintNextFrameCallback);
    }
  }
}