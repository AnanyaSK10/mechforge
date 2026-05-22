import { useEffect, useState } from "react";
import {
  ArrowRight,
  X,
  Check,
  TrendingUp,
  Layers,
  Command,
  MessageSquare,
  Eye,
  FolderOpen,
  PlayCircle,
  Users,
  Briefcase,
  ArrowUpRight,
  Star,
  Zap,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import InteractiveAura from "./components/InteractiveAura";
import InteractiveWidgets from "./components/InteractiveWidgets";
import EnrollmentModal from "./components/EnrollmentModal";
import RenderExportStudio from "./components/RenderExportStudio";
import Leaderboard from "./components/Leaderboard";
import FormulaTerminal from "./components/FormulaTerminal";

export default function App() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollTier, setEnrollTier] = useState<"basic" | "premium">("premium");
  const [activeSeat, setActiveSeat] = useState<string | null>(null);
  const [currentFaq, setCurrentFaq] = useState<number | null>(null);

  // Load existing client seat from localStorage if any
  useEffect(() => {
    const cachedSeat = localStorage.getItem("mechforge_seat");
    if (cachedSeat) {
      setActiveSeat(cachedSeat);
    }
  }, []);

  // IntersectionObserver for scroll animations (.reveal)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleOpenEnrollment = (tier: "basic" | "premium") => {
    setEnrollTier(tier);
    setIsEnrollOpen(true);
  };

  const handleEnrollSuccess = (email: string, tier: "basic" | "premium") => {
    const randomCode = Math.random().toString(16).substr(2, 5).toUpperCase();
    const mockSeat = `MF-${tier === "premium" ? "PRM" : "BSC"}-${randomCode}`;
    localStorage.setItem("mechforge_seat", mockSeat);
    setActiveSeat(mockSeat);
  };

  const handleClearSeat = () => {
    localStorage.removeItem("mechforge_seat");
    setActiveSeat(null);
  };

  const faqData = [
    {
      q: "What engineering disciplines are supported?",
      a: "MechForge covers mechanical, civil, and aerospace structural mechanics. Core lessons align directly with strength of materials, finite element beam theories, and elastic stability equations.",
    },
    {
      q: "How does the agentic tutor diagnose miscalculations?",
      a: "Our background generative structural evaluator intercepts active load variables, comparing computed stresses against yield conditions and safety criteria, matching standard GATE/FE syllabus questions directly.",
    },
    {
      q: "Is prior software experience required?",
      a: "No. MechForge contains built-in visualizers that demonstrate theoretical beam shears, bending moments, and elastic deflections immediately, requiring only basic physics foundations.",
    },
    {
      q: "How do I activate the premium certified badge?",
      a: "Inside the registration checkout modal, apply the code 'START30' to receive an instant 30% discount on both course tiers and register a lifetime certified workspace seat.",
    },
  ];

  return (
    <div className="bg-neutral-950 text-white antialiased selection:bg-[#980003] selection:text-white min-h-screen relative overflow-x-hidden font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tighter uppercase flex items-center gap-2 font-geist">
            <div className="w-3 h-3 bg-[#980003] rounded-sm rotate-45 relative">
              <span className="absolute inset-0 bg-[#980003] animate-ping opacity-60 rounded-sm" />
            </div>
            MechForge
          </div>
          
          <div className="flex items-center gap-4">
            {activeSeat ? (
              <div className="hidden sm:flex items-center gap-2 bg-[#980003]/10 border border-[#980003]/30 px-3 py-1 rounded-full text-xs text-[#980003] font-mono">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Workspace Seat {activeSeat} Active
                <button
                  type="button"
                  onClick={handleClearSeat}
                  className="ml-2 text-neutral-500 hover:text-white transition-colors"
                  title="Reset Seat"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => handleOpenEnrollment("premium")}
              className="group relative px-6 py-2 rounded-full overflow-hidden bg-white text-neutral-950 text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 font-geist">
                Register Workspace
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-[#980003]"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive Aura Background */}
      <header className="md:pt-48 md:pb-32 z-10 border-neutral-900/50 border-b pt-32 px-6 pb-20 relative overflow-hidden">
        {/* Animated Custom Aura */}
        <InteractiveAura />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="reveal active">
            <h1 className="md:text-6xl leading-[1.1] text-4xl text-white tracking-tighter font-jakarta font-bold transition-all">
              The LeetCode for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-jakarta font-extrabold">
                Mechanical Engineers
              </span>
            </h1>
          </div>

          <div
            className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto reveal active"
            style={{ transitionDelay: "100ms" }}
          >
            <p className="font-geist">
              Bridge the gap between university syllabus compliance and competitive GATE performance with real-time, agentic AI problem diagnostics.
            </p>
          </div>

          <div
            className="pt-4 flex justify-center reveal active"
            style={{ transitionDelay: "250ms" }}
          >
            <button
              onClick={() => handleOpenEnrollment("premium")}
              className="hover:bg-neutral-800 transition-all duration-300 group flex hover:text-white hover:scale-105 text-sm font-medium text-neutral-300 bg-neutral-900/50 rounded-full py-3 px-6 shadow-xl gap-x-2 items-center cursor-pointer"
              style={{
                boxShadow: "0 18px 35px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                position: "relative",
              }}
            >
              <span className="text-sm font-medium tracking-tight font-geist">Enter Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div
            className="pt-4 flex flex-col items-center justify-center space-y-4 reveal active"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#980003]/10 border border-[#980003]/20 text-xs md:text-sm text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#980003] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#980003]"></span>
              </span>
              <span className="font-geist text-xs">
                Real-time stress analyzer active. Try the slider widgets below.
              </span>
            </div>

            {activeSeat && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-lg text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <ShieldCheck className="w-4 h-4" />
                Active Engineering Workspace Seat: <strong className="underline">{activeSeat}</strong>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* The Problem Section */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto space-y-12 text-left">
          <div className="space-y-6 reveal active">
            <h2 className="text-sm font-medium text-[#980003] uppercase tracking-widest font-geist">
              The Challenge
            </h2>
            <h3 className="text-3xl md:text-4xl tracking-tight text-white font-jakarta font-medium">
              Most engineering candidates don't struggle with textbook equations.
            </h3>
          </div>

          <div className="bg-neutral-900/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-neutral-800 shadow-sm space-y-6 reveal hover-card active">
            <p className="text-neutral-400 font-medium font-geist">They struggle with translating them into exam success due to:</p>
            <ul className="space-y-4">
              {[
                "Differentiating plastic moment folds from simple elastic boundaries",
                "Identifying subtle stress concentrations in non-isotropic beam structures",
                "Calculating dynamic variables under time-constrained exam pressures",
                "Failing to gap-check university textbook theories with actual GATE/FE exam scenarios",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <div className="p-1 rounded bg-neutral-800 group-hover:bg-[#980003]/20 transition-colors">
                    <X className="w-4 h-4 text-[#980003] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-neutral-300 group-hover:text-white transition-colors font-geist text-sm">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-center reveal active">
            <p className="text-lg text-neutral-400 font-geist">
              So they compensate.{" "}
              <span className="text-white font-medium border-b border-[#980003] font-geist pb-0.5">
                Memorizing formula lists. Hoping for identical homework questions.
              </span>
            </p>
            <p className="text-2xl tracking-tight text-white font-jakarta font-medium">Still lacking diagnostic intuition.</p>
            <p className="text-neutral-500 font-geist">Rote learning is the issue. Core structural visualization is the cure.</p>
          </div>
        </div>
      </section>

      {/* What This Is & Difference */}
      <section className="relative z-10 py-24 px-6 border-y border-neutral-900 bg-neutral-900/20 text-left">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Col 1 */}
          <div className="space-y-8 reveal">
            <h2 className="text-sm font-medium text-[#980003] uppercase tracking-widest font-geist">
              What This Platform Is
            </h2>
            <div className="space-y-6 text-lg text-neutral-400 leading-relaxed">
              <p className="text-white text-2xl tracking-tight font-jakarta font-medium">
                MechForge exists for one reason: To help mechanical and structural engineering students stop guessing and start diagnosing stress anomalies correctly.
              </p>
              <p className="font-geist text-base text-neutral-400">
                Forget passive textbooks. MechForge features a real-time responsive simulation engine that reacts instantly to forces and section variables.
              </p>
              <ul className="space-y-3 pt-2 text-base text-neutral-300">
                <li className="flex items-center gap-2 font-geist">
                  <Check className="w-4 h-4 text-[#980003]" />
                  Simulate real loads &amp; materials.
                </li>
                <li className="flex items-center gap-2 font-geist">
                  <Check className="w-4 h-4 text-[#980003]" />
                  Receive immediate diagnostic evaluations.
                </li>
                <li className="flex items-center gap-2 font-geist">
                  <Check className="w-4 h-4 text-[#980003]" />
                  Bridge compliance gaps from syllabus to exam rooms.
                </li>
              </ul>
            </div>
          </div>

          {/* Col 2 */}
          <div className="reveal space-y-8 text-left" style={{ transitionDelay: "200ms" }}>
            <h2 className="text-sm font-medium text-[#980003] uppercase tracking-widest font-geist">
              Why MechForge is Different
            </h2>
            <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 text-white p-8 rounded-2xl shadow-2xl space-y-6 hover:border-[#980003]/30 transition-colors duration-500 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#980003] blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

              <p className="text-xl font-medium font-geist">This is not a passive tutorial library.</p>
              <p className="text-neutral-400 font-geist text-sm">
                You do not sit back and watch slide decks. Through active experiment and feedback loops:
              </p>
              <ul className="space-y-3 text-neutral-300 text-sm">
                {[
                  "You tweak and break beam setups in real time",
                  "You analyze stress concentration zones under an agentic tutor prompt",
                  "You learn standard competitive exam traps instantly",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 font-geist">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#980003] shadow-[0_0_10px_#980003]"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="pt-4 text-white font-medium border-t border-neutral-800 font-geist">
                This is how deep physical understanding gets accelerated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Tracks Section with Live Interactive Widgets Emulator Integrated */}
      <section className="relative z-10 py-24 px-6 bg-neutral-950 text-left">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto reveal">
            <h2 className="text-3xl md:text-4xl tracking-tight text-white font-jakarta font-medium">
              Active Specializations
            </h2>
            <p className="mt-4 text-neutral-500 font-geist">
              Move beyond static lecture sheets. Test material thresholds, review exam syllabus tracks, and download professional diagnostic reports.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Instagram Strategy Track */}
            <div className="bg-neutral-900/40 p-8 rounded-2xl border border-neutral-800 hover-card flex flex-col md:col-span-2 reveal">
              <div className="w-10 h-10 bg-[#980003]/10 border border-[#980003]/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-[#980003]" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-4 text-white font-geist">
                National Examinations Alignment
              </h3>
              <p className="text-neutral-400 mb-6 flex-grow font-geist text-sm leading-relaxed">
                MechForge map questions straight to competitive examinations (GATE, FE Civil/Mechanical, and PE Structural). Our agent highlights critical edge-cases that traditional professors ignore.
              </p>
              <div className="space-y-2 text-sm text-neutral-500 border-t border-neutral-800 pt-6">
                <p className="hover:text-neutral-300 transition-colors font-geist">
                  • Plastic collapse mechanism and hinge calculation traps
                </p>
                <p className="hover:text-neutral-300 transition-colors font-geist">
                  • Deflection limits on beams under unevenly distributed loads (UDL)
                </p>
                <p className="hover:text-neutral-300 transition-colors font-geist">
                  • Dynamic fatigue safety factor calculations
                </p>
              </div>
              <p className="mt-6 text-sm font-medium text-[#980003] font-geist">
                Verify structures to master tough competitive problems.
              </p>
            </div>

            {/* Widgets Trend Block & Live Playable UI Widget Component Embedded! */}
            <div
              className="bg-neutral-900/40 p-8 rounded-2xl border border-neutral-800 hover-card flex flex-col justify-between reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <div>
                <div className="w-10 h-10 bg-[#980003]/10 border border-[#980003]/20 rounded-lg flex items-center justify-center mb-6">
                  <Layers className="w-5 h-5 text-[#980003]" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-4 text-white font-geist">
                  Beam Deflection Engine
                </h3>
                <p className="text-neutral-400 mb-6 text-sm leading-indigo font-geist leading-relaxed">
                  Toggle different load forces and span lengths to immediately observe deformation matrices. Scroll below to test the active structural sandbox!
                </p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-white mt-auto">
                <div className="px-3 py-1 bg-neutral-800 rounded-md inline-block border border-neutral-700 font-geist mr-1.5">
                  Structural Steel
                </div>
                <div className="px-3 py-1 bg-neutral-800 rounded-md inline-block border border-neutral-700 font-geist mr-1.5">
                  Aluminum 6061
                </div>
                <div className="px-3 py-1 bg-neutral-800 rounded-md inline-block border border-neutral-700 font-geist">
                  Grade M45 Concrete
                </div>
              </div>
            </div>

            {/* LIVE PLAYABLE EMULATOR PLATFORM */}
            <div className="md:col-span-3 py-4 reveal">
              <div className="bg-[#0a0a0a] border border-[#980003]/30 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase bg-[#980003]/20 text-[#980003] px-2.5 py-1 rounded">
                      Live Testing Workbench
                    </span>
                    <h3 className="text-lg font-bold text-white font-jakarta">
                      MechForge Stress &amp; Tutor Sandbox
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    In Stage 2 and 3, you connect structural inputs instantly. Adjust spans, select alloys, and track the tutor's real-time exam suggestions.
                  </p>
                </div>
                <InteractiveWidgets />
              </div>
            </div>

            {/* Apple Style Track Info */}
            <div
              className="bg-neutral-900/40 p-8 rounded-2xl border border-neutral-800 hover-card flex flex-col md:col-span-3 reveal"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="w-10 h-10 bg-[#980003]/10 border border-[#980003]/20 rounded-lg flex items-center justify-center mb-6">
                    <Command className="w-5 h-5 text-[#980003]" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-4 text-white font-geist">
                    Agentic Diagnostics
                  </h3>
                  <p className="text-neutral-400 font-geist text-sm leading-relaxed">
                    Identify design failures before they happen. Our agent diagnoses critical structural load errors and prompts you with the correct mechanical laws required for the solution.
                  </p>
                </div>
                <div className="flex-1 bg-neutral-800/50 p-6 rounded-xl border border-neutral-700/50 w-full hover:bg-neutral-800 transition-colors">
                  <p className="text-sm text-neutral-400 mb-2 font-geist">The Solution Outcome:</p>
                  <p className="text-white font-medium font-geist text-sm leading-relaxed">
                    Master engineering calculations comfortably, allowing you to pass qualification exams with ease and guarantee real-world physical compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* LIVE PORTABLE EXPORT WORKSPACE */}
            <div className="md:col-span-3 py-6 reveal">
              <RenderExportStudio />
            </div>

          </div>
        </div>
      </section>

      {/* MechForge Arena & Interactive Formulas Arena */}
      <section className="relative z-10 py-16 px-6 border-t border-neutral-900 bg-[#07070a]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="reveal">
            <Leaderboard />
          </div>
          <div className="reveal">
            <FormulaTerminal />
          </div>
        </div>
      </section>

      {/* Structure / Roadmap Section */}
      <section className="relative z-10 py-24 px-6 md:px-12 bg-neutral-950">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center reveal">
            <h2 className="text-sm font-medium text-[#980003] uppercase tracking-widest mb-3 font-geist">
              Roadmap
            </h2>
            <h3 className="text-3xl md:text-4xl tracking-tight text-white font-jakarta font-medium">
              How the Curriculum is Structured
            </h3>
          </div>

          {/* Timeline */}
          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
            
            {/* Stage 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group reveal">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-semibold text-white group-hover:border-[#980003] group-hover:text-[#980003] transition-colors duration-300 font-geist">
                01
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 shadow-sm hover:border-[#980003]/30 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold tracking-tight text-white font-geist">
                    Stage 1 — Textbook Foundations
                  </h4>
                </div>
                <p className="text-neutral-400 text-sm mb-4 font-geist leading-relaxed">
                  Bridge basic geometry and university physics into robust beam models. Establish point forces, span limits, isotropic versus composite materials, and standard bending equations.
                </p>
                <p className="text-xs font-medium text-[#980003] bg-[#980003]/5 border border-[#980003]/10 p-2 rounded inline-block font-geist">
                  Goal: Eliminate coordinate mapping errors and outline stress limits clearly.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group reveal"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-semibold text-white group-hover:border-[#980003] group-hover:text-[#980003] transition-colors duration-300 font-geist">
                02
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 shadow-sm hover:border-[#980003]/30 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold tracking-tight text-white font-geist">
                    Stage 2 — Stress &amp; Shear Diagnosis
                  </h4>
                </div>
                <p className="text-neutral-400 text-sm mb-4 font-geist leading-relaxed">
                  Analyze dynamic load configurations. Learn Mohr’s circle parameters, principal stress transformations, and beam shear flow vectors that trigger physical fracture risks.
                </p>
                <div className="flex gap-2 flex-wrap text-xs font-mono">
                  <span className="border border-neutral-700 px-2 py-0.5 rounded-full text-neutral-400 font-geist">
                    Moment Integration
                  </span>
                  <span className="border border-neutral-700 px-2 py-0.5 rounded-full text-neutral-400 font-geist">
                    Shear Diagnostics
                  </span>
                  <span className="border border-neutral-700 px-2 py-0.5 rounded-full text-neutral-400 font-geist">
                    Safety Bounds
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group reveal"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#980003] bg-[#980003] text-white shadow-[0_0_15px_rgba(152,0,3,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-semibold font-geist">
                03
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gradient-to-br from-neutral-900 to-[#1a0001] p-6 rounded-2xl border border-[#980003]/30 shadow-lg hover:shadow-[0_0_30px_rgba(152,0,3,0.15)] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold tracking-tight text-white font-geist">
                    Stage 3 — National Exam Readiness
                  </h4>
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-[#980003] text-white px-2 py-1 rounded shadow-lg font-geist">
                    EXAM PREP
                  </span>
                </div>
                <p className="text-neutral-300 text-sm mb-4 font-geist leading-relaxed">
                  Solve real-world FE/GATE question arrays. Break down boundary condition exceptions, plastic hinge buckling risks, and rapid numeric stress limits under exam timers.
                </p>
                <p className="text-xs font-medium text-white/60 font-geist leading-relaxed">
                  Refining visual physical mechanics intuition so numerical calculations become second nature.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Deliverables Section ("What You Get") */}
      <section className="relative z-10 py-24 px-6 border-y border-neutral-900 bg-neutral-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium text-[#980003] uppercase tracking-widest mb-10 text-center reveal font-geist">
            MechForge Ecosystem
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-[#980003]/30 transition-all hover:-translate-y-2 reveal hover:shadow-lg">
              <div className="p-3 bg-neutral-800 rounded-full mb-4 text-[#980003]">
                <MessageSquare className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-medium text-white font-geist">Agentic AI Tutor</h4>
              <p className="text-sm text-neutral-500 mt-2 font-geist">Instant structural stress diagnostics</p>
            </div>

            {/* 2 */}
            <div
              className="flex flex-col items-center text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-[#980003]/30 transition-all hover:-translate-y-2 reveal hover:shadow-lg"
              style={{ transitionDelay: "50ms" }}
            >
              <div className="p-3 bg-neutral-800 rounded-full mb-4 text-[#980003]">
                <Eye className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-medium text-white font-geist">Visual Feedback Studio</h4>
              <p className="text-sm text-neutral-500 mt-2 font-geist">Real-time deflection animations</p>
            </div>

            {/* 3 */}
            <div
              className="flex flex-col items-center text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover-card transition-all hover:-translate-y-2 reveal hover:shadow-lg"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="p-3 bg-neutral-800 rounded-full mb-4 text-[#980003]">
                <FolderOpen className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-medium text-white font-geist">Reference Blueprints</h4>
              <p className="text-sm text-neutral-500 mt-2 font-geist">Accurate PDF and CSV numerical results</p>
            </div>

            {/* 4 */}
            <div
              className="flex flex-col items-center text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-[#980003]/30 transition-all hover:-translate-y-2 reveal hover:shadow-lg"
              style={{ transitionDelay: "150ms" }}
            >
              <div className="p-3 bg-neutral-800 rounded-full mb-4 text-[#980003]">
                <PlayCircle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-medium text-white font-geist">Curriculum Maps</h4>
              <p className="text-sm text-neutral-500 mt-2 font-geist">FE Structural / GATE Syllabus direct codes</p>
            </div>

            {/* 5 */}
            <div
              className="flex flex-col items-center text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-[#980003]/30 transition-all hover:-translate-y-2 reveal hover:shadow-lg"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="p-3 bg-neutral-800 rounded-full mb-4 text-[#980003]">
                <Users className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-medium text-white font-geist">Study Cohorts</h4>
              <p className="text-sm text-neutral-500 mt-2 font-geist">Interactive Peer Calculation Forums</p>
            </div>

            {/* 6 */}
            <div
              className="flex flex-col items-center text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-[#980003]/30 transition-all hover:-translate-y-2 reveal hover:shadow-lg"
              style={{ transitionDelay: "250ms" }}
            >
              <div className="p-3 bg-neutral-800 rounded-full mb-4 text-[#980003]">
                <Briefcase className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-medium text-white font-geist">Practice Problems</h4>
              <p className="text-sm text-neutral-500 mt-2 font-geist">Hundreds of exam-simulating loads</p>
            </div>

          </div>

          <div className="mt-12 text-center text-lg font-medium text-white reveal">
            <p className="font-geist">This is active. You are expected to design, calculate, and participate.</p>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Area added to address typical student queries on program environment */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#980003]/10 border border-[#980003]/20 text-xs text-neutral-300 font-mono">
              <HelpCircle className="w-3.5 h-3.5 text-[#980003]" />
              CURRICULUM FAQ
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-jakarta">Have Questions? We Have Answers.</h3>
          </div>

          <div className="space-y-3">
            {faqData.map((item, idx) => (
              <div 
                key={idx}
                className="bg-neutral-900/40 rounded-xl border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setCurrentFaq(currentFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center text-neutral-200 hover:text-white font-medium text-[15px] focus:outline-none"
                >
                  <span className="font-geist">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${currentFaq === idx ? "rotate-180 text-[#980003]" : ""}`} />
                </button>
                <div 
                  className={`px-5 pb-5 text-sm text-neutral-400 font-geist transition-all duration-300 ${currentFaq === idx ? "block opacity-100" : "hidden opacity-0"}`}
                >
                  <p className="leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For vs NOT For Section */}
      <section className="relative z-10 py-24 px-6 border-b border-neutral-900 bg-neutral-950/20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* For */}
          <div className="reveal space-y-6">
            <h3 className="text-xl font-semibold tracking-tight text-white mb-2 font-geist">
              Who this is for
            </h3>
            <ul className="space-y-4">
              {[
                "Engineering students moving into advanced structural design",
                "GATE / FE Civil / Mechanical candidates preparing for physical mechanics",
                "Designers whose structural calculation builds lack verification standards",
                "Graduates aiming for licensed engineering qualifications (PE)",
              ].map((text, idx) => (
                <li key={idx} className="flex gap-3 text-neutral-400 group font-geist text-sm">
                  <Check className="w-5 h-5 text-[#980003] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-medium text-white bg-neutral-900 border border-neutral-800 p-4 rounded-lg inline-block font-geist">
              Basic physics knowledge is welcome. You do not need absolute mastery to start. You need structured guidance.
            </p>
          </div>

          {/* Not For */}
          <div className="reveal space-y-6" style={{ transitionDelay: "100ms" }}>
            <h3 className="text-xl font-semibold tracking-tight text-white mb-2 font-geist">
              Who this is NOT for
            </h3>
            <ul className="space-y-4">
              {[
                "You want quick tricks and automated assignment-solver shortcuts",
                "You only want to watch video slides without practicing calculations",
                "You are unwilling to study real material behavior rules",
              ].map((text, idx) => (
                <li key={idx} className="flex gap-3 text-neutral-400 font-geist text-sm">
                  <X className="w-5 h-5 text-neutral-600 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-medium text-neutral-500 p-4 rounded-lg inline-block border border-neutral-800/50 font-geist">
              This platform rewards persistent physical model practice.
            </p>
          </div>

        </div>
      </section>

      {/* Results without hype Section */}
      <section className="z-10 bg-neutral-900/10 py-24 px-6 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl tracking-tight text-white reveal font-jakarta font-medium">
            Results without hype
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto reveal">
            {[
              "Build accurate structural designs faster",
              "Stop repeating mechanical calculation traps",
              "Gain confidence under competitive physics exam timers",
              "Obtain licenses and academic excellence without stress",
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-neutral-900 p-4 rounded-lg border border-neutral-800 hover:border-[#980003]/50 transition-colors cursor-default"
              >
                <ArrowUpRight className="w-5 h-5 text-[#980003] shrink-0" />
                <span className="text-neutral-300 font-geist text-sm">{text}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-neutral-500 reveal font-geist">
            No empty promises. No magical guarantees. Just real work and real progress.
          </p>
        </div>
      </section>



      {/* Footer / Final Pitch Call to Action */}
      <footer className="bg-neutral-950 z-10 border-neutral-900 border-t py-24 px-6 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8 reveal">
          <h2 className="text-3xl tracking-tight text-white font-jakarta font-medium">
            Most candidates stay stuck because they delay practice.
          </h2>
          <div className="space-y-2 text-neutral-500 text-lg">
            <p className="font-geist">They wait for passive lecture schedules.</p>
            <p className="font-geist">They wait for perfect algebraic confidence.</p>
            <p className="font-geist">They wait for standard classroom tests.</p>
          </div>
          <p className="text-xl font-medium text-white font-geist">
            Physical comprehension comes after you build. Not before.
          </p>

          <div className="pt-8">
            <p className="mb-6 text-neutral-400 font-geist">
              If you want to stop guessing stress thresholds and secure exam compliance,
            </p>
            <p className="text-2xl tracking-tight mb-8 text-white font-jakarta font-medium">
              get started with MechForge today.
            </p>

            <button
              onClick={() => handleOpenEnrollment("premium")}
              className="inline-flex items-center gap-2 hover:bg-[#b00004] transition-all hover:shadow-[0_0_40px_rgba(152,0,3,0.6)] hover:scale-105 active:scale-95 text-base font-medium text-white bg-[#980003] rounded-full py-4 px-8 shadow-[0_0_20px_rgba(152,0,3,0.4)] font-geist"
            >
              Start MechForge Workspace (Free)
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-12 text-sm text-neutral-600 font-geist">
            © MechForge. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Interactive checkout simulator modal */}
      <EnrollmentModal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        tier={enrollTier}
        onSuccess={handleEnrollSuccess}
      />

    </div>
  );
}
