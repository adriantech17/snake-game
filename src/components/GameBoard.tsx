import { useRef, useEffect } from 'react';
import { type Position, BOARD_SIZE } from '../engine/gameEngine';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameBoardProps {
  readonly snake: readonly Position[];
  readonly food: Position;
  readonly gameOver: boolean;
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const CELL = 28;               // px per logical cell
const SIZE = BOARD_SIZE * CELL; // total canvas resolution

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:        '#0d1214',
  grid:      'rgba(255,255,255,0.04)',
  headTop:   '#a8ffb4',
  headBot:   '#16892c',
  bodyTop:   '#2acb45',
  bodyBot:   '#11742a',
  food:      '#ff6b6b',
  overlay:   'rgba(0,0,0,0.82)',
  textMain:  '#e6edf3',
  textSub:   '#8b949e',
  danger:    '#f85149',
} as const;

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= BOARD_SIZE; i++) {
    const o = i * CELL;
    ctx.beginPath(); ctx.moveTo(o, 0);    ctx.lineTo(o, SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, o);    ctx.lineTo(SIZE, o); ctx.stroke();
  }
}

function drawFood(ctx: CanvasRenderingContext2D, food: Position): void {
  const cx = food.x * CELL + CELL / 2;
  const cy = food.y * CELL + CELL / 2;
  const r  = CELL * 0.38;

  // Soft glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.7);
  glow.addColorStop(0, 'rgba(255,107,107,0.55)');
  glow.addColorStop(1, 'rgba(255,107,107,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.7, 0, Math.PI * 2);
  ctx.fill();

  // Berry
  const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.3, 0, cx, cy, r);
  grad.addColorStop(0, '#ffe5e5');
  grad.addColorStop(0.4, C.food);
  grad.addColorStop(1, '#cc0f0f');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  seg: Position,
  colorTop: string,
  colorBot: string,
): void {
  const pad = 2;
  const x   = seg.x * CELL + pad;
  const y   = seg.y * CELL + pad;
  const w   = CELL - pad * 2;
  const rad = CELL * 0.38;

  const grad = ctx.createLinearGradient(x, y, x, y + w);
  grad.addColorStop(0, colorTop);
  grad.addColorStop(1, colorBot);
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.roundRect(x, y, w, w, rad);
  ctx.fill();
}

function drawSnake(ctx: CanvasRenderingContext2D, snake: readonly Position[]): void {
  // Body segments (back → front so head renders on top)
  for (let i = snake.length - 1; i >= 1; i--) {
    const seg = snake[i];
    if (seg !== undefined) {
      drawSegment(ctx, seg, C.bodyTop, C.bodyBot);
    }
  }

  // Head
  const head = snake[0];
  if (head === undefined) return;

  drawSegment(ctx, head, C.headTop, C.headBot);

  // Eyes
  const eyeR = CELL * 0.10;
  const eyeY = head.y * CELL + CELL * 0.32;
  const lx   = head.x * CELL + CELL * 0.27;
  const rx   = head.x * CELL + CELL * 0.73;

  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(lx, eyeY, eyeR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(rx, eyeY, eyeR, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#111';
  const pupilR = eyeR * 0.55;
  ctx.beginPath(); ctx.arc(lx + eyeR * 0.2, eyeY + eyeR * 0.5, pupilR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(rx + eyeR * 0.2, eyeY + eyeR * 0.5, pupilR, 0, Math.PI * 2); ctx.fill();
}

function drawGameOver(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = C.overlay;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  ctx.font      = `bold ${CELL * 1.1}px system-ui, sans-serif`;
  ctx.fillStyle = C.danger;
  ctx.fillText('GAME OVER', SIZE / 2, SIZE / 2 - CELL * 0.9);

  ctx.font      = `${CELL * 0.58}px system-ui, sans-serif`;
  ctx.fillStyle = C.textSub;
  ctx.fillText('Press SPACE or tap Restart', SIZE / 2, SIZE / 2 + CELL * 0.3);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GameBoard({ snake, food, gameOver }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    drawBackground(ctx);
    drawFood(ctx, food);
    drawSnake(ctx, snake);
    if (gameOver) drawGameOver(ctx);
  }, [snake, food, gameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{
        display: 'block',
        width: 'min(92vmin, 560px)',
        height: 'min(92vmin, 560px)',
        borderRadius: '14px',
        margin: '20px 0',
        boxShadow: '0 12px 36px rgba(0,0,0,0.45), 0 0 0 3px #65cf7b',
      }}
      aria-label="Snake game board"
      role="img"
    />
  );
}

export default GameBoard;

