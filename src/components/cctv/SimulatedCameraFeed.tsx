import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, Minimize2, VideoOff, AlertCircle } from 'lucide-react';
import { CCTVCamera } from '../../types';

interface SimulatedCameraFeedProps {
  camera: CCTVCamera;
  isFocused?: boolean;
  onToggleFocus?: () => void;
}

export const SimulatedCameraFeed: React.FC<SimulatedCameraFeedProps> = ({
  camera,
  isFocused,
  onToggleFocus,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
          now.getDate()
        ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Canvas animation for realistic CCTV motion simulation
  useEffect(() => {
    if (camera.status === 'OFFLINE') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    // Simulated people moving in room
    const entities = [
      { x: 40, y: 110, vx: 0.8, vy: 0.2, color: '#94a3b8', size: 14 },
      { x: 140, y: 150, vx: -0.6, vy: 0.4, color: '#64748b', size: 16 },
      { x: 220, y: 80, vx: 0.5, vy: -0.3, color: '#475569', size: 12 },
    ];

    const render = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background room layout
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);

      // Draw room perspective lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Floor line
      ctx.moveTo(0, h * 0.7);
      ctx.lineTo(w, h * 0.7);
      // Perspective corridor corners
      ctx.moveTo(w * 0.2, 0);
      ctx.lineTo(0, h * 0.7);
      ctx.moveTo(w * 0.8, 0);
      ctx.lineTo(w, h * 0.7);
      ctx.stroke();

      // Desks / Furniture outlines
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w * 0.25, h * 0.55, w * 0.18, h * 0.15);
      ctx.fillRect(w * 0.55, h * 0.55, w * 0.22, h * 0.15);

      // Warning flicker effect if WARNING
      if (camera.status === 'WARNING' && frameCount % 30 < 5) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.fillRect(0, 0, w, h);
      }

      // Animate moving occupants
      entities.forEach((entity) => {
        entity.x += entity.vx;
        entity.y += entity.vy;

        if (entity.x < 30 || entity.x > w - 30) entity.vx *= -1;
        if (entity.y < h * 0.35 || entity.y > h * 0.85) entity.vy *= -1;

        // Draw simulated person shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(entity.x, entity.y + entity.size + 2, entity.size * 0.8, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw body
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(entity.x, entity.y - entity.size * 0.7, entity.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle CCTV scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera.status]);

  return (
    <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-md group">
      {/* Feed Canvas or Offline Screen */}
      {camera.status === 'OFFLINE' ? (
        <div className="w-full h-48 sm:h-56 bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center">
          <VideoOff className="w-8 h-8 text-rose-500/80 animate-pulse" />
          <div className="text-xs font-bold text-slate-300">CCTV FEED DISCONNECTED</div>
          <div className="text-[10px] text-slate-500 font-mono">
            IP: {camera.ipAddress} · NVR SIGNAL LOSS
          </div>
        </div>
      ) : (
        <div className="relative w-full h-48 sm:h-56">
          <canvas
            ref={canvasRef}
            width={360}
            height={220}
            className="w-full h-full object-cover block"
          />
        </div>
      )}

      {/* Top CCTV Overlay */}
      <div className="absolute top-0 left-0 right-0 p-2.5 bg-linear-to-b from-black/80 to-transparent flex items-center justify-between text-[11px] font-mono text-white pointer-events-none">
        <div className="flex items-center gap-2">
          {camera.status === 'ONLINE' && (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          )}
          {camera.status === 'WARNING' && (
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              PACKET LOSS
            </span>
          )}
          <span className="text-slate-300 truncate max-w-[140px] font-semibold">
            {camera.cameraName}
          </span>
        </div>

        <div className="text-[10px] text-slate-300 font-mono">25.0 FPS</div>
      </div>

      {/* Bottom CCTV Telemetry Watermark */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between text-[10px] font-mono text-slate-300 pointer-events-none">
        <div>
          <div className="font-semibold text-white truncate max-w-[180px]">
            {camera.location} · {camera.resolution}
          </div>
          <div className="text-slate-400">{currentTime || '2026-09-04 11:42:15 IST'}</div>
        </div>

        {onToggleFocus && (
          <button
            type="button"
            onClick={onToggleFocus}
            className="p-1 rounded bg-black/60 hover:bg-black text-white pointer-events-auto transition"
            title="Toggle Focus"
          >
            {isFocused ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};
