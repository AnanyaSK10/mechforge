import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  Code, 
  ChevronRight, 
  Calculator, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  Info, 
  Layers, 
  Sliders, 
  Settings2,
  Flame,
  Droplets,
  Activity,
  Zap,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TerminalLine {
  text: string;
  type: "input" | "error" | "output" | "success" | "system" | "matrix" | "formula";
}

export default function FormulaTerminal() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "⚡ MECHFORGE INTELLIGENT FORMULA CONTROLLER [V4.5]", type: "system" },
    { text: "SYS: CORE CALCULATION ENGINES INITIATED // MEMORY OK", type: "success" },
    { text: "RUNNING REAL-TIME MATHEMATICAL SIMULATOR SHELL.", type: "system" }
  ]);
  const [activeTab, setActiveTab] = useState<"pelton" | "epicyclic" | "taylor">("pelton");
  const [codeLanguage, setCodeLanguage] = useState<"python" | "matlab" | "javascript">("python");
  const [copied, setCopied] = useState(false);

  // Dynamic animation tickers
  const [tick, setTick] = useState(0);

  // Dynamic state for formula visual calculator inputs
  // Pelton parameters
  const [peltonU, setPeltonU] = useState(22); // Bucket speed, u (m/s)
  const [peltonV, setPeltonV] = useState(50); // Jet speed, V1 (m/s)
  const [peltonBeta, setPeltonBeta] = useState(165); // Blade outlet angle (degrees)
  const [peltonK, setPeltonK] = useState(0.95); // Friction factor, k

  // Epicyclic parameters
  const [teethSun, setTeethSun] = useState(40);
  const [teethRing, setTeethRing] = useState(120);
  const [speedArm, setSpeedArm] = useState(100); // RPM
  const [speedSun, setSpeedSun] = useState(300); // RPM

  // Taylor Tool Life parameters
  const [cuttingSpeed, setCuttingSpeed] = useState(120); // V, m/min
  const [exponentN, setExponentN] = useState(0.25); // n, typical for carbide
  const [constantC, setConstantC] = useState(250); // C, constant

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Spark coordinate system for Taylor lathe cutting animation
  interface Spark {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Handle continuous rotation loops and particle generator updates smoothly
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setTick((t) => t + 0.05);
      
      // Update lathe tool cutter spark particles
      setSparks((prevSparks) => {
        const nextSparks = prevSparks
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vy: s.vy + 0.1, // mild gravity simulation
            life: s.life - 0.05,
          }))
          .filter((s) => s.life > 0);

        // Periodically inject new active sparks at coordinates (350, 60)
        if (nextSparks.length < 15 && Math.random() < 0.4) {
          nextSparks.push({
            id: Math.random(),
            x: 350,
            y: 60,
            vx: Math.random() * 4 + 1,
            vy: (Math.random() - 0.5) * 5,
            life: Math.random() * 0.8 + 0.4,
          });
        }
        return nextSparks;
      });

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const addLine = (text: string, type: "input" | "error" | "output" | "success" | "system" | "matrix" | "formula") => {
    setHistory((prev) => [...prev, { text, type }]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const trimmed = command.toLowerCase().trim();
    addLine(`$ ${command}`, "input");
    setCommand("");

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];

    switch (cmd) {
      case "help":
        addLine("✨ MECHFORGE INTEL FIRMWARE - SOLVER SHELL MANUAL", "system");
        addLine("  pelton <u> <v> <beta> - Compute Pelton Turbine efficiency", "output");
        addLine("  gear <ts> <tr> <ns>   - Transpose Epicyclic gear speeds", "output");
        addLine("  taylor <v> <n> <c>    - Estimate Taylor tool life longevity", "output");
        addLine("  sysinfo               - Render solver kernel details", "output");
        addLine("  clear                 - Clear output terminal log", "output");
        break;

      case "clear":
        setHistory([]);
        break;

      case "sysinfo":
        addLine("🛰️ CHIPSET METRICS STATE:", "system");
        addLine("  • Port Binding     : local ingress secure context", "output");
        addLine("  • Active Envelopes : Fluid Turbines, Epicyclic Gears, Life Wear Tribology", "output");
        addLine("  • Parser Execution : Multithread Math Core [ACTIVE]", "success");
        break;

      case "pelton": {
        if (parts.length < 4) {
          addLine("❌ Error: Missing args: 'pelton <u> <v> <beta>'", "error");
          break;
        }
        const u = parseFloat(parts[1]);
        const v = parseFloat(parts[2]);
        const b = parseFloat(parts[3]);
        if (isNaN(u) || isNaN(v) || isNaN(b) || v <= 0) {
          addLine("❌ Error: Invalid input parameters.", "error");
        } else {
          setPeltonU(u);
          setPeltonV(v);
          setPeltonBeta(b);
          setActiveTab("pelton");
        }
        break;
      }

      case "gear": {
        if (parts.length < 4) {
          addLine("❌ Error: Missing args: 'gear <sun_teeth> <ring_teeth> <sun_rpm>'", "error");
          break;
        }
        const ts = parseInt(parts[1]);
        const tr = parseInt(parts[2]);
        const ns = parseFloat(parts[3]);
        if (isNaN(ts) || isNaN(tr) || isNaN(ns)) {
          addLine("❌ Error: Invalid gear specs.", "error");
        } else {
          setTeethSun(ts);
          setTeethRing(tr);
          setSpeedSun(ns);
          setActiveTab("epicyclic");
        }
        break;
      }

      case "taylor": {
        if (parts.length < 4) {
          addLine("❌ Error: Missing args: 'taylor <velocity> <exponent> <constant>'", "error");
          break;
        }
        const ve = parseFloat(parts[1]);
        const n = parseFloat(parts[2]);
        const c = parseFloat(parts[3]);
        if (isNaN(ve) || isNaN(n) || isNaN(c) || ve <= 0 || n <= 0) {
          addLine("❌ Error: Invalid boundary values.", "error");
        } else {
          setCuttingSpeed(ve);
          setExponentN(n);
          setConstantC(c);
          setActiveTab("taylor");
        }
        break;
      }

      default:
        addLine(`❌ Command unrecognized: '${cmd}'. Enter 'help' for guidance.`, "error");
        break;
    }
  };

  const computedPeltonEff = () => {
    const betaRad = (peltonBeta * Math.PI) / 180;
    const thetaRad = Math.PI - betaRad;
    const eta = (2 * (peltonV - peltonU) * (1 + peltonK * Math.cos(thetaRad)) * peltonU) / Math.pow(peltonV, 2);
    return Math.min(Math.max(eta * 100, 0), 100);
  };

  const computedPlanetTeeth = () => Math.max(1, Math.round((teethRing - teethSun) / 2));
  const computedPlanetSpeed = () => {
    const y = speedArm;
    const x = speedSun - y;
    const tP = computedPlanetTeeth();
    return y - x * (teethSun / tP);
  };
  const computedRingSpeed = () => {
    const y = speedArm;
    const x = speedSun - y;
    return y - x * (teethSun / teethRing);
  };

  const computedToolLife = () => {
    if (cuttingSpeed >= constantC) return 0;
    return Math.pow(constantC / cuttingSpeed, 1 / exponentN);
  };

  // Preset configuration setups
  const applyPreset = (type: string, presetName: string) => {
    if (type === "pelton") {
      switch (presetName) {
        case "low":
          setPeltonU(12); setPeltonV(26); setPeltonBeta(165);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Low Head Micro turbine u=12 m/s, V1=26 m/s, β=165°", type: "success" }]);
          break;
        case "medium":
          setPeltonU(22); setPeltonV(48); setPeltonBeta(170);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Medium Head Standard u=22 m/s, V1=48 m/s, β=170°", type: "success" }]);
          break;
        case "high":
          setPeltonU(35); setPeltonV(75); setPeltonBeta(165);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: High Head Peak u=35 m/s, V1=75 m/s, β=165°", type: "success" }]);
          break;
      }
    } else if (type === "epicyclic") {
      switch (presetName) {
        case "differential":
          setTeethSun(32); setTeethRing(120); setSpeedArm(120); setSpeedSun(360);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Automotive Differential gearing Sun=32T, Ring=120T", type: "success" }]);
          break;
        case "turbine":
          setTeethSun(18); setTeethRing(96); setSpeedArm(-80); setSpeedSun(400);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Step-up Wind Turbine Gearbox Sun=18T, Ring=96T", type: "success" }]);
          break;
        case "tracker":
          setTeethSun(24); setTeethRing(144); setSpeedArm(10); setSpeedSun(60);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Solar Positioner High-Reduct Sun=24T, Ring=144T", type: "success" }]);
          break;
      }
    } else if (type === "taylor") {
      switch (presetName) {
        case "hss":
          setExponentN(0.12); setConstantC(70); setCuttingSpeed(35);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: HSS Cutter on carbon steel n=0.12, C=70, V=35 m/min", type: "success" }]);
          break;
        case "carbide":
          setExponentN(0.25); setConstantC(250); setCuttingSpeed(120);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Carbide inserts on alloy steel n=0.25, C=250, V=120 m/min", type: "success" }]);
          break;
        case "ceramic":
          setExponentN(0.50); setConstantC(650); setCuttingSpeed(220);
          setHistory(prev => [...prev, { text: "⚙️ APPLIED PRESET: Ceramic coating tool on nickel alloy n=0.50, C=650, V=220 m/min", type: "success" }]);
          break;
      }
    }
  };

  // Generate copyable script formulations dynamically
  const getExportCode = () => {
    if (activeTab === "pelton") {
      switch (codeLanguage) {
        case "python":
          return `def calc_pelton(u, v1, beta, k=0.95):
    import math
    if u >= v1: return 0.0
    v_rad = math.radians(beta)
    eta = 2 * (v1 - u) * (1 + k * math.cos(math.pi - v_rad)) * u / (v1 ** 2)
    return min(max(eta * 100.0, 0.0), 100.0)

eff = calc_pelton(u=${peltonU}, v1=${peltonV}, beta=${peltonBeta}, k=${peltonK})
print(f"Pelton Efficiency: {eff:.2f}%")`;
        case "matlab":
          return `function eta_pct = calc_pelton(u, v1, beta, k)
    if u >= v1; eta_pct = 0.0; return; end
    theta = pi - deg2rad(beta);
    eta = 2 * (v1 - u) * (1 + k * cos(theta)) * u / (v1^2);
    eta_pct = min(max(eta * 100, 0), 100);
end

eff = calc_pelton(${peltonU}, ${peltonV}, ${peltonBeta}, ${peltonK})`;
        case "javascript":
          return `function calcPelton(u, v1, beta, k = 0.95) {
  if (u >= v1) return 0;
  const theta = Math.PI - (beta * Math.PI / 180);
  const eta = (2 * (v1 - u) * (1 + k * Math.cos(theta)) * u) / Math.pow(v1, 2);
  return Math.min(Math.max(eta * 100, 0), 100);
}

console.log(calcPelton(${peltonU}, ${peltonV}, ${peltonBeta}, ${peltonK}));`;
      }
    } else if (activeTab === "epicyclic") {
      switch (codeLanguage) {
        case "python":
          return `def solve_gears(t_sun, t_ring, n_arm, n_sun):
    t_planet = int((t_ring - t_sun) / 2)
    y = n_arm
    x = n_sun - y
    n_planet = y - x * (t_sun / max(1, t_planet))
    n_ring = y - x * (t_sun / t_ring)
    return {"planet": n_planet, "ring": n_ring}

sol = solve_gears(t_sun=${teethSun}, t_ring=${teethRing}, n_arm=${speedArm}, n_sun=${speedSun})
print(sol)`;
        case "matlab":
          return `function sol = solve_gears(t_sun, t_ring, n_arm, n_sun)
    t_planet = round((t_ring - t_sun) / 2);
    y = n_arm;
    x = n_sun - y;
    n_planet = y - x * (t_sun / max(1, t_planet));
    n_ring = y - x * (t_sun / t_ring);
    sol = [n_planet, n_ring];
end

sol = solve_gears(${teethSun}, ${teethRing}, ${speedArm}, ${speedSun})`;
        case "javascript":
          return `function solveGears(tS, tR, nArm, nSun) {
  const tP = Math.round((tR - tS) / 2);
  const y = nArm; const x = nSun - y;
  return { planet: y - x * (tS / Math.max(1, tP)), ring: y - x * (tS / tR) };
}

console.log(solveGears(${teethSun}, ${teethRing}, ${speedArm}, ${speedSun}));`;
      }
    } else {
      switch (codeLanguage) {
        case "python":
          return `def taylor_life(v, n, c):
    if v >= c: return 0.0
    return (c / v) ** (1.0 / n)

life = taylor_life(v=${cuttingSpeed}, n=${exponentN}, c=${constantC})
print(f"Tool Life: {life:.2f} mins")`;
        case "matlab":
          return `function minutes = taylor_life(v, n, c)
    if v >= c; minutes = 0; return; end
    minutes = (c / v)^(1.0 / n);
end

mins = taylor_life(${cuttingSpeed}, ${exponentN}, ${constantC})`;
        case "javascript":
          return `function taylorLife(v, n, c) {
  if (v >= c) return 0;
  return Math.pow(c / v, 1 / n);
}

console.log(taylorLife(${cuttingSpeed}, ${exponentN}, ${constantC}));`;
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 space-y-6 shadow-2xl text-left" id="formula-terminal">
      
      {/* Header and Quick Switcher Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-[#980003]/10 text-[#980003] border border-[#980003]/20 text-[10px] font-mono font-bold rounded uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#980003] animate-pulse"></span>
              CORE SOLVER SYSTEM
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">SYS_VER // MECH_V4.6</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-[#980003]" />
            MechForge Formula Terminal
          </h2>
        </div>

        {/* Tab Buttons Selection */}
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-850 text-xs font-mono">
          {[
            { id: "pelton", label: "Pelton Turbine" },
            { id: "epicyclic", label: "Epicyclic Gears" },
            { id: "taylor", label: "Taylor Wear" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold uppercase relative text-[10px] sm:text-xs tracking-wider ${
                activeTab === tab.id ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTerminalTab"
                  className="absolute inset-0 bg-[#980003] rounded-lg -z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Multi-Column Action Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* PANEL 1: Dynamic Interactive Terminal Bash Console (4 Columns) */}
        <div className="md:col-span-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1">
              <TerminalIcon className="w-3.5 h-3.5 text-neutral-500" />
              CLI Shell Interface
            </h3>
            <button 
              onClick={() => setHistory([])} 
              className="text-[9px] font-mono text-[#980003] hover:underline"
            >
              Flush Logs
            </button>
          </div>
          
          <div className="flex flex-col bg-[#050608] border border-neutral-850 rounded-xl overflow-hidden h-[300px] relative">
            <div className="bg-neutral-900/60 px-3 py-2 border-b border-neutral-850 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
              <span>BASH_INPUT // HOST_GATE</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>

            {/* Terminal output wrapper */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[9px] sm:text-[10px] leading-relaxed space-y-1.5 bg-[#030406] text-neutral-300 scrollbar-thin">
              {history.map((line, idx) => (
                <div
                  key={idx}
                  className={`p-1 rounded ${
                    line.type === "input" ? "text-neutral-200" :
                    line.type === "error" ? "text-red-400 bg-red-950/20 px-1.5" :
                    line.type === "success" ? "text-emerald-400 bg-emerald-950/20 px-1.5 font-semibold" :
                    line.type === "system" ? "text-[#980003] font-bold" :
                    "text-neutral-400"
                  }`}
                >
                  {line.type === "input" ? (
                    <span className="flex items-center gap-1">
                      <span className="text-[#980003]">&gt;</span>
                      {line.text}
                    </span>
                  ) : (
                    <span>{line.text}</span>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick action submit bar */}
            <form onSubmit={handleCommandSubmit} className="bg-[#0b0c10] border-t border-neutral-900 px-3 py-2 flex items-center gap-2">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Type 'help' for shell guidelines..."
                className="flex-1 bg-transparent border-none text-[11px] text-neutral-200 outline-none font-mono placeholder:text-neutral-700"
              />
              <button 
                type="submit" 
                className="px-2.5 py-1 bg-[#980003] hover:bg-[#b50004] text-white text-[9px] uppercase font-mono font-bold rounded"
              >
                EXEC
              </button>
            </form>
          </div>

          {/* Preset Buttons Bank below shell */}
          <div className="bg-neutral-950 p-2.5 border border-neutral-850 rounded-xl space-y-1.5">
            <span className="text-[9px] font-mono text-neutral-500 block uppercase font-bold tracking-wider">Console Presets:</span>
            <div className="flex flex-wrap gap-1">
              <button 
                onClick={() => setCommand("pelton 22 50 165")}
                className="px-2 py-1 bg-neutral-900 hover:bg-[#980003]/20 border border-neutral-800 hover:border-[#980003]/30 rounded text-[9px] font-mono text-neutral-400 transition"
              >
                $ pelton
              </button>
              <button 
                onClick={() => setCommand("gear 40 120 300")}
                className="px-2 py-1 bg-neutral-900 hover:bg-[#980003]/20 border border-neutral-800 hover:border-[#980003]/30 rounded text-[9px] font-mono text-neutral-400 transition"
              >
                $ gear
              </button>
              <button 
                onClick={() => setCommand("taylor 120 0.25 250")}
                className="px-2 py-1 bg-neutral-900 hover:bg-[#980003]/20 border border-neutral-800 hover:border-[#980003]/30 rounded text-[9px] font-mono text-neutral-400 transition"
              >
                $ taylor
              </button>
              <button 
                onClick={() => setCommand("sysinfo")}
                className="px-2 py-1 bg-neutral-900 hover:bg-[#980003]/20 border border-neutral-800 hover:border-[#980003]/30 rounded text-[9px] font-mono text-neutral-400 transition"
              >
                $ sysinfo
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: Parametric Sliders & Fast Material Constant presets libraries (4 Columns) */}
        <div className="md:col-span-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-neutral-500" />
              Engine Param Drivers
            </h3>
            <span className="text-[9px] font-mono text-[#980003]">LIVE TUNING</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex-1 flex flex-col justify-between space-y-4">
            
            {/* Dynamic Sider Parameter list based on Active Tab */}
            <div className="space-y-4">
              {activeTab === "pelton" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">BUCKET SPEED (u)</span>
                      <span className="text-emerald-400 font-bold">{peltonU} m/s</span>
                    </div>
                    <input
                      type="range" min="5" max="50" step="1" value={peltonU}
                      onChange={(e) => setPeltonU(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">JET SPEED (V1)</span>
                      <span className="text-emerald-400 font-bold">{peltonV} m/s</span>
                    </div>
                    <input
                      type="range" min="20" max="100" step="1" value={peltonV}
                      onChange={(e) => setPeltonV(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">BLADE OUTLET (β)</span>
                      <span className="text-emerald-400 font-bold">{peltonBeta}°</span>
                    </div>
                    <input
                      type="range" min="120" max="175" step="1" value={peltonBeta}
                      onChange={(e) => setPeltonBeta(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                </div>
              )}

              {activeTab === "epicyclic" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">SUN TEETH (T_sun)</span>
                      <span className="text-neutral-200 font-bold">{teethSun}T</span>
                    </div>
                    <input
                      type="range" min="16" max="60" step="2" value={teethSun}
                      onChange={(e) => setTeethSun(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">RING TEETH (T_ring)</span>
                      <span className="text-neutral-200 font-bold">{teethRing}T</span>
                    </div>
                    <input
                      type="range" min="80" max="180" step="4" value={teethRing}
                      onChange={(e) => setTeethRing(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">N_ARM (RPM)</span>
                      <input
                        type="range" min="-120" max="250" step="5" value={speedArm}
                        onChange={(e) => setSpeedArm(parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 appearance-none rounded accent-[#980003]"
                      />
                      <span className="text-[10px] text-neutral-300 font-mono font-bold block">{speedArm}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 font-mono uppercase block">N_SUN (RPM)</span>
                      <input
                        type="range" min="-200" max="500" step="10" value={speedSun}
                        onChange={(e) => setSpeedSun(parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-800 appearance-none rounded accent-[#980003]"
                      />
                      <span className="text-[10px] text-neutral-300 font-mono font-bold block">{speedSun}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "taylor" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">CUTTING SPEED (V)</span>
                      <span className="text-emerald-400 font-bold">{cuttingSpeed} m/min</span>
                    </div>
                    <input
                      type="range" min="20" max="250" step="5" value={cuttingSpeed}
                      onChange={(e) => setCuttingSpeed(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">EXPONENT (n)</span>
                      <span className="text-emerald-400 font-bold">{exponentN.toFixed(2)}</span>
                    </div>
                    <input
                      type="range" min="0.10" max="0.55" step="0.05" value={exponentN}
                      onChange={(e) => setExponentN(parseFloat(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">CONSTANT (C)</span>
                      <span className="text-emerald-400 font-bold">{constantC}</span>
                    </div>
                    <input
                      type="range" min="100" max="755" step="25" value={constantC}
                      onChange={(e) => setConstantC(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-[#980003]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* MATERIAL/COEFFICIENT PRESETS LIBRARY BANK (REPLACE CLUMSY DESCRIPTIONS COHESIVELY) */}
            <div className="border-t border-neutral-900 pt-3 mt-1 text-xs">
              <span className="text-[9px] font-mono font-bold text-[#980003] uppercase tracking-wider block mb-2">
                📂 Industrial Pre-sets Library:
              </span>

              {activeTab === "pelton" && (
                <div className="grid grid-cols-3 gap-1">
                  <button 
                    onClick={() => applyPreset("pelton", "low")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">LOW HEAD</span>
                    V=26, u=12
                  </button>
                  <button 
                    onClick={() => applyPreset("pelton", "medium")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">MED HEAD</span>
                    V=48, u=22
                  </button>
                  <button 
                    onClick={() => applyPreset("pelton", "high")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">HIGH HEAD</span>
                    V=75, u=35
                  </button>
                </div>
              )}

              {activeTab === "epicyclic" && (
                <div className="grid grid-cols-3 gap-1">
                  <button 
                    onClick={() => applyPreset("epicyclic", "differential")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">CAR DIFF</span>
                    Sun=32T, R=120
                  </button>
                  <button 
                    onClick={() => applyPreset("epicyclic", "turbine")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">WIND FEED</span>
                    Sun=18T, R=96
                  </button>
                  <button 
                    onClick={() => applyPreset("epicyclic", "tracker")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">REDUCTION</span>
                    Sun=24T, R=144
                  </button>
                </div>
              )}

              {activeTab === "taylor" && (
                <div className="grid grid-cols-3 gap-1">
                  <button 
                    onClick={() => applyPreset("taylor", "hss")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">HSS / STEEL</span>
                    n=0.12, C=70
                  </button>
                  <button 
                    onClick={() => applyPreset("taylor", "carbide")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">CARBIDE</span>
                    n=0.25, C=250
                  </button>
                  <button 
                    onClick={() => applyPreset("taylor", "ceramic")}
                    className="p-1 px-1.5 bg-neutral-900 overflow-hidden hover:bg-neutral-800 border border-neutral-800 rounded text-[9px] text-center text-neutral-300 transition"
                  >
                    <span className="font-bold text-[8px] block text-[#980003]">CERAMIC</span>
                    n=0.50, C=650
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* PANEL 3: Realtime SVG Particle Simulation Graphic Renderers & Solution outputs (4 Columns) */}
        <div className="md:col-span-4 flex flex-col space-y-3">
          <h3 className="text-[10px] font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-neutral-500" />
            Simulation &amp; Gauge Stream
          </h3>

          <div className="relative bg-[#06070a] border border-neutral-850 p-4 rounded-xl flex-1 flex flex-col justify-between h-[300px] overflow-hidden">
            <span className="absolute top-2 left-3 text-[8px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#980003] animate-ping"></span>
              Live Physics Output
            </span>

            {activeTab === "pelton" && (
              <div className="flex-1 flex flex-col justify-between pt-4">
                {/* Visual Turbine Diagram */}
                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#2a2d36" strokeWidth="2" />
                    
                    {/* Active jet */}
                    <path d="M 0 50 L 35 50" stroke="#38bdf8" strokeWidth="3" />
                    <line x1="0" y1="50" x2="35" y2="50" stroke="#fff" strokeWidth="1" strokeDasharray="5 5" style={{ strokeDashoffset: -tick * 30 }} />

                    {/* Deflected water splash */}
                    <path d="M 35 50 Q 40 45 30 35 M 35 50 Q 40 55 30 65" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />

                    {/* Dynamic Rotating buckets wheel */}
                    <g style={{ transformOrigin: "50px 50px", transform: `rotate(${tick * peltonU * 1.5}deg)` }}>
                      <circle cx="50" cy="50" r="22" fill="#13151a" stroke="#4a5064" strokeWidth="1.5" />
                      <circle cx="50" cy="50" r="6" fill="#000" stroke="#ef4444" strokeWidth="1" />
                      
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const bx = 50 + 22 * Math.cos(rad);
                        const by = 50 + 22 * Math.sin(rad);
                        return (
                          <g key={i} transform={`translate(${bx}, ${by}) rotate(${angle})`}>
                            <path d="M -3 -5 Q 3 -5 4 0 Q 3 5 -3 5" fill="none" stroke="#565f89" strokeWidth="1.5" />
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                {/* Efficiency Gauge */}
                <div className="bg-neutral-950 p-2 border border-neutral-900 rounded-lg flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">RUNNER η_hyd:</span>
                  <div className="text-right">
                    <span className="text-sm font-mono font-black text-emerald-400">{computedPeltonEff().toFixed(2)}%</span>
                    <span className="text-[8px] font-mono text-neutral-500 block">u/V1 ratio: {(peltonU/peltonV).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "epicyclic" && (
              <div className="flex-1 flex flex-col justify-between pt-4">
                {/* Visual Gear Set representation */}
                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    {/* Ring gear */}
                    <g style={{ transformOrigin: "50px 50px", transform: `rotate(${(tick * computedRingSpeed() * 0.15) % 360}deg)` }}>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#565f89" strokeWidth="2.5" strokeDasharray="5 3" />
                    </g>

                    {/* Carrier arm line representation */}
                    <g style={{ transformOrigin: "50px 50px", transform: `rotate(${(tick * speedArm * 0.15) % 360}deg)` }}>
                      <line x1="50" y1="50" x2="50" y2="22" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      <line x1="50" y1="50" x2="22" y2="64" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      <line x1="50" y1="50" x2="78" y2="64" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="3" fill="#ef4444" />
                    </g>

                    {/* Centre Sun Gear */}
                    <g style={{ transformOrigin: "50px 50px", transform: `rotate(${(tick * speedSun * 0.15) % 360}deg)` }}>
                      <circle cx="50" cy="50" r="14" fill="#06070a" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                      <text x="50" y="53" textAnchor="middle" fill="#38bdf8" className="text-[7px] font-mono font-bold">{teethSun}T</text>
                    </g>

                    {/* Simple planet representation pinning on the carrier */}
                    <g style={{ transformOrigin: "50px 50px", transform: `rotate(${(tick * speedArm * 0.15) % 360}deg)` }}>
                      <circle cx="50" cy="22" r="12" fill="#14151f" stroke="#a9b1d6" strokeWidth="1" strokeDasharray="2 2" />
                    </g>
                  </svg>
                </div>

                {/* Output speeds display */}
                <div className="bg-neutral-950 p-2 border border-neutral-900 rounded-lg text-[9px] font-mono leading-none space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase">Planet speed (nP):</span>
                    <span className="text-amber-400 font-bold">{computedPlanetSpeed().toFixed(1)} RPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 uppercase">Ring Speed (nR):</span>
                    <span className="text-cyan-400 font-bold">{computedRingSpeed().toFixed(1)} RPM</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "taylor" && (
              <div className="flex-1 flex flex-col justify-between pt-4">
                {/* Visual Lathe Tool Machining simulation */}
                <div className="flex-1 flex items-center justify-center relative">
                  <svg viewBox="0 0 100 60" className="w-28 h-16">
                    {/* Chuck */}
                    <rect x="0" y="15" width="15" height="30" fill="#20222a" stroke="#464c63" strokeWidth="1" />
                    {/* Cylindrical Stock pieces */}
                    <rect x="15" y="20" width="50" height="20" fill="#0f1118" stroke="#3c4257" />
                    <rect x="65" y="24" width="20" height="12" fill="#090a0f" stroke="#252936" />
                    
                    {/* Spin direction arrow loop */}
                    <line x1="15" y1="30" x2="65" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 4" style={{ strokeDashoffset: tick * 15 }} />

                    {/* Lathe Sparks */}
                    <g>
                      {sparks.map((s) => (
                        <circle 
                          key={s.id}
                          cx={s.x / 5}
                          cy={s.y / 2.5}
                          r="0.8"
                          fill={s.life > 0.45 ? "#fb923c" : "#fef08a"}
                        />
                      ))}
                    </g>

                    {/* Cutter inserts path representation */}
                    <path d="M 69 5 L 63 24 L 75 24 Z" fill="#980003" />
                    <circle cx="64" cy="24" r="1.5" fill="#fbbf24" className="animate-ping" />
                  </svg>
                </div>

                {/* Predicted longevity metric bar */}
                <div className="bg-neutral-950 p-2 border border-neutral-900 rounded-lg flex items-center justify-between font-mono">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">EST TOOL LIFE:</span>
                  <div className="text-right">
                    <span className={`text-sm font-mono font-black ${computedToolLife() > 40 ? "text-emerald-400" : computedToolLife() > 10 ? "text-amber-400" : "text-rose-500 animate-pulse"}`}>
                      {computedToolLife() > 0 ? `${computedToolLife().toFixed(1)} mins` : "FUSED_COLLAPSE"}
                    </span>
                    <span className="text-[8px] text-neutral-500 block">material cap ratio: {(cuttingSpeed/constantC).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* FOOTER SECTION: Standard Mathematics Model and Copyable Code panel */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-4">
        
        {/* Tab-integrated Formula visualizer and Exporter selection bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-2.5">
          <span className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#980003]" />
            Formula Model Quick-Syllabus References
          </span>

          <div className="flex bg-neutral-900 p-0.5 rounded border border-neutral-800 text-[10px] font-mono">
            {["python", "matlab", "javascript"].map((lang) => (
              <button
                key={lang}
                onClick={() => setCodeLanguage(lang as any)}
                className={`px-3 py-1 rounded transition-all uppercase font-semibold text-[9px] sm:text-[10px] ${
                  codeLanguage === lang ? "bg-[#980003] text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {lang === "javascript" ? "JS" : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Formula Specs (Shortened & Refined) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          <div className="bg-neutral-900/45 p-3 rounded-lg border border-neutral-900 space-y-1 relative">
            <span className="absolute right-2 top-2 text-[8px] font-bold text-[#980003] bg-[#980003]/5 px-2 py-0.5 rounded uppercase font-mono border border-[#980003]/10">Mathematical Model</span>
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block">Governing Theory:</span>
            
            {activeTab === "pelton" && (
              <div className="space-y-1">
                <div className="text-white font-bold text-sm">η_hyd = [ 2 * (V₁ - u) * (1 + k * cos(180 - β)) * u ] / V₁²</div>
                <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
                  Peak hydraulic output optimal target speed ratio occurs globally where <strong>u / V₁ = 0.5</strong>.
                </p>
              </div>
            )}

            {activeTab === "epicyclic" && (
              <div className="space-y-1">
                <div className="text-white font-bold text-sm">N_sun = y + x &nbsp;|&nbsp; N_ring = y - x * (T_sun / T_ring)</div>
                <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
                  Enforces plant teeth spacing constraint equation: <strong>T_planet = (T_ring - T_sun) / 2</strong>.
                </p>
              </div>
            )}

            {activeTab === "taylor" && (
              <div className="space-y-1">
                <div className="text-white font-bold text-sm">V * Tⁿ = C &nbsp;&rArr;&nbsp; T = (C / V)^(1 / n)</div>
                <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
                  Linear tool lathe wear index n generally ranges from 0.12 (HSS steel) to 0.50 (hard structural Ceramics).
                </p>
              </div>
            )}
          </div>

          {/* Clean Exportable Snippet codeblock */}
          <div className="relative">
            <pre className="bg-[#040507] p-3 text-[10px] rounded-lg text-emerald-400 font-mono overflow-x-auto max-h-[100px] border border-neutral-900 select-text leading-normal">
              {getExportCode()}
            </pre>
            <button
              onClick={handleCopyCode}
              className="absolute right-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-1 rounded text-neutral-400 hover:text-white transition shadow"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
