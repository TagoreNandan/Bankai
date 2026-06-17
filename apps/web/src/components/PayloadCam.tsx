import { useEffect, useRef, useState } from "react";
import { Maximize2, Video } from "lucide-react";
import { useTelemetryStore } from "../store/telemetryStore";

export default function PayloadCam() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const latest = useTelemetryStore((s) => s.latest);
    const [recFlash, setRecFlash] = useState(true);

    // Recording dot flash interval
    useEffect(() => {
        const interval = setInterval(() => {
            setRecFlash((prev) => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Draw canvas overlay & graphics
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let angle = 0;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement?.clientWidth || 320;
            canvas.height = 180;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear screen with custom background gradient (sky-space grayscale)
            ctx.fillStyle = "#161b22";
            ctx.fillRect(0, 0, width, height);

            // Draw earth curvature
            ctx.beginPath();
            ctx.arc(width / 2, height * 2.2, height * 1.5, Math.PI, 2 * Math.PI);
            ctx.fillStyle = "#0d1117";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(0, 243, 255, 0.15)";
            ctx.stroke();

            // Draw Earth atmospheric glow
            ctx.beginPath();
            ctx.arc(width / 2, height * 2.2, height * 1.5 + 4, Math.PI, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 243, 255, 0.08)";
            ctx.stroke();

            // Draw grid lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 25) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let j = 0; j < height; j += 25) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(width, j);
                ctx.stroke();
            }

            // Draw dynamic orbital scan curve
            angle += 0.005;
            ctx.beginPath();
            ctx.moveTo(0, height * 0.4 + Math.sin(angle) * 8);
            ctx.bezierCurveTo(
                width * 0.25,
                height * 0.35 + Math.sin(angle) * 12,
                width * 0.75,
                height * 0.6 + Math.cos(angle) * 8,
                width,
                height * 0.45 + Math.sin(angle) * 10
            );
            ctx.strokeStyle = "rgba(0, 243, 255, 0.05)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw tracking crosshair
            const cx = width / 2;
            const cy = height / 2;
            ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
            ctx.lineWidth = 1;

            // Reticle box
            ctx.strokeRect(cx - 15, cy - 15, 30, 30);
            
            // Reticle corners
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 10, cy);
            ctx.moveTo(cx + 10, cy); ctx.lineTo(cx + 20, cy);
            ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy - 10);
            ctx.moveTo(cx, cy + 10); ctx.lineTo(cx, cy + 20);
            ctx.stroke();

            // Draw target bracket
            const tx = cx + Math.sin(angle * 2) * 40;
            const ty = cy + Math.cos(angle * 1.5) * 20;
            ctx.strokeStyle = "#ff007f";
            ctx.lineWidth = 1;
            ctx.strokeRect(tx - 10, ty - 10, 20, 20);
            
            ctx.fillStyle = "#ff007f";
            ctx.font = "8px monospace";
            ctx.fillText("TRK_TGT_01", tx + 14, ty - 4);

            // Draw overlay camera scan text details
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.font = "7px JetBrains Mono, monospace";
            ctx.fillText("MODE: IR / SATELLITE", 10, 20);
            ctx.fillText(`FOV: 45° LENS: M12`, 10, 32);
            ctx.fillText(`ZOOM: 1.0X`, 10, 44);

            const telemetryTime = latest ? new Date(latest.timestamp * 1000).toISOString().substr(11, 8) : "--:--:--";
            ctx.fillText(`UTC: ${telemetryTime}`, 10, height - 12);
            ctx.fillText(`AZ: 184.2° EL: 22.1°`, width - 110, height - 12);

            // Draw simulated noise overlay
            ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
            for (let n = 0; n < 300; n++) {
                const nx = Math.floor(Math.random() * width);
                const ny = Math.floor(Math.random() * height);
                ctx.fillRect(nx, ny, 1, 1);
            }

            // Draw subtle horizontal scanline
            const scanlineY = (angle * 60) % height;
            ctx.fillStyle = "rgba(0, 243, 255, 0.03)";
            ctx.fillRect(0, scanlineY, width, 2);

            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [latest]);

    return (
        <div className="relative overflow-hidden rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full bg-[#ff007f] ${recFlash ? "opacity-100" : "opacity-20"} transition-opacity duration-300`}></span>
                    <span className="text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                        PAYLOAD_CAM_01
                    </span>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase">
                    HD FEED: 1080P
                </span>
            </div>

            <div className="relative overflow-hidden rounded border border-[#1c2630] h-[180px]">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Overlay buttons at bottom-right of feed */}
                <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                    <button className="flex items-center justify-center rounded bg-[#0b0f13]/80 border border-[#1c2630] p-1.5 text-zinc-400 hover:text-[#00f3ff] hover:bg-[#1c2630] transition-colors cursor-pointer">
                        <Video size={10} />
                    </button>
                    <button className="flex items-center justify-center rounded bg-[#0b0f13]/80 border border-[#1c2630] p-1.5 text-zinc-400 hover:text-[#00f3ff] hover:bg-[#1c2630] transition-colors cursor-pointer">
                        <Maximize2 size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
}
