import { useState } from "react";
import { Trophy, Medal, MapPin, Building, ShieldCheck, Sparkles, SlidersHorizontal, ArrowUpRight, Search, Zap } from "lucide-react";
import { motion } from "motion/react";

interface RankEntry {
  rank: number;
  name: string;
  institution: string;
  score: number;
  badge?: string;
  isCurrentUser?: boolean;
}

interface InstitutionalEntry {
  rank: number;
  name: string;
  location: string;
  activeUsers: number;
  passRatio: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 15,
    },
  },
};

export default function Leaderboard() {
  const [toggleRegion, setToggleRegion] = useState<"hubballi" | "national">("hubballi");
  const [searchQuery, setSearchQuery] = useState("");

  // Individual Student Rankings (Grid 1)
  const individualsHubballi: RankEntry[] = [
    { rank: 1, name: "Ananya Shrinath Kamanahalli", institution: "KLE Technological University (BVBCET), Hubballi", score: 994, badge: "Grandmaster // Premium Seat", isCurrentUser: true },
    { rank: 2, name: "Srinivas Kulkarni", institution: "SDM College of Engineering, Dharwad", score: 942, badge: "Master Certified" },
    { rank: 3, name: "Priyanka Patil", institution: "KLE Tech, Hubballi", score: 915, badge: "Master Certified" },
    { rank: 4, name: "Girish Hosur", institution: "Basaveshwar Engineering College, Bagalkot", score: 884, badge: "Elite" },
    { rank: 5, name: "Deepak Hiremath", institution: "KLE Tech, Taluka Campus", score: 861, badge: "Elite" },
    { rank: 6, name: "Megha Annigeri", institution: "AIT, Chikmagalur", score: 830, badge: "Candidate" }
  ];

  const individualsNational: RankEntry[] = [
    { rank: 1, name: "Ananya Shrinath Kamanahalli", institution: "KLE Technological University, Hubballi Campus", score: 994, badge: "All-India Rank 1 // Premium Seat", isCurrentUser: true },
    { rank: 2, name: "Rohan Malhotra", institution: "IIT Bombay, Powai", score: 981, badge: "Master Certified" },
    { rank: 3, name: "Aditi Sharma", institution: "BITS Pilani, Goa Campus", score: 974, badge: "Master Certified" },
    { rank: 4, name: "Sai Karthik", institution: "IIT Madras, Chennai", score: 962, badge: "Elite Certified" },
    { rank: 5, name: "Chinmayee Ghosh", institution: "Jadavpur University, Kolkata", score: 955, badge: "Elite Certified" },
    { rank: 6, name: "Tushar Gupta", institution: "Delhi Technological University, Delhi", score: 948, badge: "Elite" }
  ];

  // Institutional Rankings (Grid 2)
  const institutionsHubballi: InstitutionalEntry[] = [
    { rank: 1, name: "KLE Technological University (BVB)", location: "Hubballi, Karnataka", activeUsers: 342, passRatio: "98.4%" },
    { rank: 2, name: "SDM College of Engineering", location: "Dharwad, Karnataka", activeUsers: 198, passRatio: "94.2%" },
    { rank: 3, name: "Basaveshwar Engineering College", location: "Bagalkot, Karnataka", activeUsers: 112, passRatio: "91.8%" },
    { rank: 4, name: "KLE Institute of Technology", location: "Hubballi, Karnataka", activeUsers: 84, passRatio: "89.5%" }
  ];

  const institutionsNational: InstitutionalEntry[] = [
    { rank: 1, name: "IIT Madras (Indian Institute of Technology)", location: "Chennai, Tamil Nadu", activeUsers: 1450, passRatio: "99.2%" },
    { rank: 2, name: "KLE Technological University", location: "Hubballi, Karnataka", activeUsers: 620, passRatio: "98.4%" },
    { rank: 3, name: "COEP Technological University", location: "Pune, Maharashtra", activeUsers: 512, passRatio: "97.1%" },
    { rank: 4, name: "IIT Bombay (Indian Institute of Technology)", location: "Mumbai, Maharashtra", activeUsers: 1104, passRatio: "96.8%" }
  ];

  const currentIndividuals = toggleRegion === "hubballi" 
    ? individualsHubballi.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : individualsNational.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const currentInstitutions = toggleRegion === "hubballi" ? institutionsHubballi : institutionsNational;

  return (
    <div className="w-full bg-neutral-900/40 rounded-2xl border border-neutral-800/80 p-6 space-y-6 shadow-xl text-left" id="leaderboard">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#980003]/10 text-[#980003] text-[10px] font-mono font-bold rounded uppercase tracking-wider">
              Live Standings Dashboard
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">UPDATED: 5 SECONDS AGO</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight font-jakarta flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            MechForge Arena Leaderboard
          </h2>
          <p className="text-xs text-neutral-400">
            Compare calculated stress scoring factors against engineering peers.
          </p>
        </div>

        {/* Region selection toggle */}
        <div className="flex items-center gap-3">
          {/* Live search */}
          <div className="relative hover:border-neutral-700 transition">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-950/60 text-xs text-neutral-200 pl-8 pr-3 py-1.5 rounded-lg border border-neutral-800 focus:border-[#980003] focus:outline-none w-44"
            />
          </div>

          <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[11px] font-mono">
            <button
              onClick={() => setToggleRegion("hubballi")}
              className={`px-3 py-1.5 h-8 rounded transition-all font-semibold flex items-center gap-1 ${
                toggleRegion === "hubballi" ? "bg-[#980003] text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Hubballi Region
            </button>
            <button
              onClick={() => setToggleRegion("national")}
              className={`px-3 py-1.5 h-8 rounded transition-all font-semibold flex items-center gap-1 ${
                toggleRegion === "national" ? "bg-[#980003] text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              National Rank
            </button>
          </div>
        </div>
      </div>

      {/* Dual Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        
        {/* GRID 1: Individual Standings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
              <Medal className="w-4 h-4 text-amber-500" />
              Individual Peer Rank Roster
            </h3>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">
              {toggleRegion === "hubballi" ? "KLE Tech/Dharwad Focus" : "All India Exam candidates"}
            </span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-850 rounded-xl overflow-hidden shadow-lg select-text font-geist">
            {currentIndividuals.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">No candidates found match standard criteria</div>
            ) : (
              <motion.div
                key={toggleRegion}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-neutral-900"
              >
                {currentIndividuals.map((user) => (
                  <motion.div
                    key={`${toggleRegion}-indiv-${user.rank}-${user.name}`}
                    variants={itemVariants}
                    className={`p-3.5 flex items-center justify-between transition-all relative ${
                      user.isCurrentUser 
                        ? "bg-gradient-to-r from-[#980003]/10 to-[#980003]/2 bg-[#980003]/5 border-l-2 border-l-[#980003]" 
                        : "hover:bg-neutral-900/30"
                    }`}
                  >
                    {/* Crown or medal for topper */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center font-mono text-xs font-bold text-neutral-400">
                        {user.rank === 1 ? (
                          <span className="inline-block p-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px]">👑 P1</span>
                        ) : user.rank === 2 ? (
                          <span className="text-neutral-300">#2</span>
                        ) : user.rank === 3 ? (
                          <span className="text-neutral-400">#3</span>
                        ) : (
                          `#${user.rank}`
                        )}
                      </div>
                      
                      <div className="space-y-0.5 max-w-[210px] sm:max-w-xs md:max-w-md">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${user.isCurrentUser ? "text-white font-bold" : "text-neutral-200"}`}>
                            {user.name}
                          </span>
                          {user.isCurrentUser && (
                            <span className="inline-flex items-center gap-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[8px] font-mono px-1 rounded uppercase">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Premium Verified (YOU)
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 block truncate">{user.institution}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <span className="text-xs font-mono font-bold text-[#980003] bg-[#980003]/5 border border-[#980003]/10 px-2 py-0.5 rounded">
                        {user.score} pts
                      </span>
                      {user.badge && (
                        <div className="text-[8px] font-mono text-amber-500 block">
                          ✦ {user.badge}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* GRID 2: Institutional Standing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-red-500" />
              Institutional Benchmark Standing
            </h3>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">
              Active campuses comparing pass factors
            </span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-850 rounded-xl overflow-hidden shadow-lg font-geist text-left">
            <motion.div
              key={toggleRegion}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-neutral-900"
            >
              {currentInstitutions.map((inst) => (
                <motion.div
                  key={`${toggleRegion}-inst-${inst.rank}-${inst.name}`}
                  variants={itemVariants}
                  className="p-3.5 flex items-center justify-between hover:bg-neutral-900/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center font-mono text-xs font-bold text-neutral-500">
                      #{inst.rank}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-200 block">{inst.name}</span>
                      <span className="text-[10px] text-neutral-500 block">{inst.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Active Seats</span>
                      <span className="text-xs font-mono text-neutral-300">{inst.activeUsers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">GATE Pass ratio</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{inst.passRatio}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Quick promotion details card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#980003]/5 to-[#1a0001] border border-[#980003]/20 flex items-center justify-between gap-4 font-geist text-xs text-neutral-300 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-20 h-20 bg-[#980003]/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="space-y-1 relative z-10">
              <p className="font-semibold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#980003]" />
                Top 1% Global Hubballi Recognition
              </p>
              <p className="text-[11px] text-neutral-400">
                Hubballi students registered under MechForge lead overall solvers by an margin of 14% on shear moment modules.
              </p>
            </div>
            <a href="#formula-terminal" className="shrink-0 p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-[#980003] hover:text-white hover:bg-[#980003] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
