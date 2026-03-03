import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export function DemoBanner() {
  const navigate = useNavigate();
  return (
    <div className="mx-3 sm:mx-6 mt-3 sm:mt-6 mb-1 rounded-2xl overflow-hidden flex-shrink-0">
      <div
        className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-white/90 leading-snug truncate">
            <span className="text-white font-bold">Demo mode.</span>{" "}
            <span className="hidden sm:inline">Sign up free to connect your real phone number.</span>
            <span className="sm:hidden">Sign up to get started.</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/sign-up")}
          className="flex items-center gap-1 bg-white text-indigo-700 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap flex-shrink-0 shadow-md"
        >
          Get Started
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}
