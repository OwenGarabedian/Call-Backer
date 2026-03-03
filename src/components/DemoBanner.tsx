import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export function DemoBanner() {
  const navigate = useNavigate();
  return (
    <div className="mx-6 mt-6 mb-1 rounded-2xl overflow-hidden flex-shrink-0">
      <div
        className="flex items-center justify-between gap-4 px-5 py-3.5"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs font-semibold text-white/90 leading-snug">
            <span className="text-white font-bold">You're viewing demo data.</span>{" "}
            Sign up free to connect your real phone number and start capturing leads.
          </p>
        </div>
        <button
          onClick={() => navigate("/sign-up")}
          className="flex items-center gap-1.5 bg-white text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap flex-shrink-0 shadow-md"
        >
          Get Started
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
