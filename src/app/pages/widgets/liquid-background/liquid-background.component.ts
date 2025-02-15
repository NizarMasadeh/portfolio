import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
}

@Component({
  selector: 'app-liquid-background',
  templateUrl: './liquid-background.component.html',
  styleUrls: ['./liquid-background.component.scss']
})
export class LiquidBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('liquidCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrame: number = 0;
  private scrollPosition = 0;
  private points: Point[] = [];
  private mouse = { x: 0, y: 0, radius: 100 };
  private gridSize = 50;
  private stiffness = 0.1;
  private damping = 0.9;

  ngOnInit() {
    this.setupPoints();
    this.setupEventListeners();
  }

  ngAfterViewInit(): void {
    console.log('Initializing canvas...');
    this.initCanvas();
    console.log('Starting animation...');
    this.animate();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    console.log('Canvas element:', canvas);
    this.ctx = canvas.getContext('2d')!;

    if (!this.ctx) {
      console.error('Could not get 2D context for canvas');
      return;
    }

    console.log('Canvas context initialized:', this.ctx);

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.setupPoints();
    };

    setSize();
    window.addEventListener('resize', setSize);
  }

  private setupPoints() {
    this.points = [];
    const canvas = this.canvasRef.nativeElement;
    for (let y = 0; y < canvas.height; y += this.gridSize) {
      for (let x = 0; x < canvas.width; x += this.gridSize) {
        this.points.push({
          x,
          y,
          vx: 0,
          vy: 0,
          originalX: x,
          originalY: y
        });
      }
    }
  }

  private setupEventListeners() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  private handleScroll() {
    this.scrollPosition = window.scrollY;
  }

  private getColorFromScroll(): string {
    const scrollPercent = this.scrollPosition / (document.documentElement.scrollHeight - window.innerHeight);
    const hue = (scrollPercent * 60) + 270;
    return `hsla(${hue}, 70%, 60%, 0.1)`;
  }

  private updatePoints() {
    this.points.forEach(point => {
      const dx = this.mouse.x - point.x;
      const dy = this.mouse.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * 8;
        const pushY = Math.sin(angle) * force * 8;

        point.vx += -pushX;
        point.vy += -pushY;
      }

      const dx2 = point.originalX - point.x;
      const dy2 = point.originalY - point.y;
      point.vx += dx2 * this.stiffness;
      point.vy += dy2 * this.stiffness;

      point.vx *= this.damping;
      point.vy *= this.damping;

      point.x += point.vx;
      point.y += point.vy;
    });
  }

  private drawMesh() {
    const color = this.getColorFromScroll();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    const canvas = this.canvasRef.nativeElement;
    const pointsPerRow = Math.floor(canvas.width / this.gridSize);

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const nextRowIndex = i + pointsPerRow;

      if (this.points[i + 1] && (i + 1) % pointsPerRow !== 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
        this.ctx.stroke();
      }

      if (this.points[nextRowIndex]) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(this.points[nextRowIndex].x, this.points[nextRowIndex].y);
        this.ctx.stroke();
      }
    }
  }

  private animate() {
    if (!this.ctx) {
      console.error('Canvas context is not initialized');
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.filter = 'blur(1px)';

    this.updatePoints();
    this.drawMesh();

    this.ctx.filter = 'none';

    setTimeout(() => {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }, 1000 / 100);
  }

  private cleanup() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);
  }
}