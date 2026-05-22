import { useState, useEffect, FormEvent } from "react";
import { X, ShieldCheck, Mail, User, CheckCircle2, Sparkles, Download } from "lucide-react";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "basic" | "premium";
  onSuccess: (email: string, tier: "basic" | "premium") => void;
}

export default function EnrollmentModal({ isOpen, onClose, tier, onSuccess }: EnrollmentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"fill" | "loading" | "done">("fill");
  const [loadingText, setLoadingText] = useState("Connecting safely...");
  const [generatedSeatId, setGeneratedSeatId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCheckoutStep("fill");
      setName("");
      setEmail("");
    }
  }, [isOpen]);

  const handlePay = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in your name and email.");
      return;
    }

    setCheckoutStep("loading");
    setLoadingText("Initializing safe environment socket...");

    setTimeout(() => {
      setLoadingText("Generating student seat credentials...");
    }, 1000);

    setTimeout(() => {
      setLoadingText("Encrypting digital engineering license...");
    }, 2000);

    setTimeout(() => {
      const randHex = Math.random().toString(16).substr(2, 6).toUpperCase();
      const seat = `MF-FREE-${randHex}`;
      setGeneratedSeatId(seat);
      setCheckoutStep("done");
      onSuccess(email, tier);
    }, 3200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl flex flex-col">
        {/* Header decoration bar */}
        <div className="h-1 bg-gradient-to-r from-neutral-800 via-[#980003] to-neutral-800" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Fill Out Registration */}
        {checkoutStep === "fill" && (
          <form onSubmit={handlePay} className="p-6 md:p-8 space-y-6">
            <div className="space-y-1 text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#980003] font-semibold bg-[#980003]/10 px-2.5 py-0.5 rounded-full inline-block">
                Free Platform Access
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight font-jakarta">Claim Workspace Seat</h3>
              <p className="text-xs text-neutral-400">Claim your lifetime free certified learning socket instantly.</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase text-left">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ananya Shrinath"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#980003]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase text-left">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#980003]"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 text-left">Your personalized study credentials and solver history maps are synchronized and saved localCached.</p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-lg border border-neutral-900">
                <span className="text-xs text-neutral-400">Seat Price:</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">100% Free</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#980003] hover:bg-[#b00004] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(152,0,3,0.3)] font-mono"
              >
                Launch Setup Socket
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Progress Simulator */}
        {checkoutStep === "loading" && (
          <div className="p-8 md:p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#980003] border-r-transparent animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white font-mono animate-pulse">{loadingText}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Active Secure Connection</p>
            </div>
          </div>
        )}

        {/* Step 3: Registration Code and Download Receipt */}
        {checkoutStep === "done" && (
          <div className="p-6 md:p-8 text-center space-y-6">
            <div className="flex flex-col items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              <h3 className="text-xl font-bold text-white tracking-tight font-jakarta">Seat Activated!</h3>
              <p className="text-xs text-neutral-300">You now have direct unlimited access to MechForge.</p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 relative overflow-hidden text-left font-mono">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
              
              <div className="space-y-1">
                <span className="block text-[9px] text-neutral-500">ASSIGNED SEAT LICENSE</span>
                <span className="block text-sm font-bold text-emerald-400 tracking-wider">{generatedSeatId}</span>
              </div>

              <div className="space-y-0.5 border-t border-neutral-900 pt-2 text-[11px] text-neutral-400">
                <p><span className="text-neutral-500">Engineer Email:</span> {email}</p>
                <p><span className="text-neutral-500">Subscription Status:</span> Free Lifetime Seat</p>
                <p><span className="text-neutral-500">Environment Port:</span> initialized on 3000</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Access backup verification code ${generatedSeatId} downloaded successfully.`);
                }}
                className="flex-1 py-2 px-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-[11px] font-semibold text-neutral-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Receipt PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 bg-[#980003] hover:bg-[#b00004] text-[11px] font-bold text-white uppercase rounded-lg tracking-wider transition-colors"
              >
                Close &amp; Enter
              </button>
            </div>

            <p className="text-[10px] text-neutral-500 mt-2 font-mono">
              Welcome aboard! Your verified session token has been Cached client-side.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
