import { useEffect, useRef, useState } from "react";

export default function InteractiveAura() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-neutral-950"
    >
      {/* Primary Red Glow Ambient */}
      <div
        className="absolute inset-0 opacity-40 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle 500px at ${mousePos.x}% ${mousePos.y}%, rgba(152, 0, 3, 0.45) 0%, rgba(152, 0, 3, 0.08) 50%, transparent 100%)`,
        }}
      />

      {/* Secondary Static Slow Floating Aura Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#980003] rounded-full blur-[130px] opacity-25 animate-pulse duration-[8000ms] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#980003] rounded-full blur-[150px] opacity-20 animate-pulse duration-[12000ms] pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Tiny ambient floating dust particles */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <div className="absolute w-2 h-2 rounded-full bg-white/20 top-20 left-[15%] animate-bounce duration-[6000ms]" />
        <div className="absolute w-1 h-1 rounded-full bg-[#980003]/80 top-40 right-[25%] animate-bounce duration-[800ms] delay-1000" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/10 bottom-36 left-[40%] animate-ping duration-[4000ms]" />
        <div className="absolute w-1 h-1 rounded-full bg-[#980003] bottom-20 right-[15%] animate-pulse duration-[3000ms]" />
      </div>

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Red Tint & Gradients strictly overlaying like in the original */}
      <div className="absolute inset-0 bg-[#980003] mix-blend-color opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950/95" />
    </div>
  );
}
