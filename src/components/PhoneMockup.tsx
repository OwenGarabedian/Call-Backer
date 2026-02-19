import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, PhoneIncoming, ArrowLeft, Video, Phone as PhoneIcon, Plus, ArrowUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface PhoneMockupProps {
  scrollUp?: MotionValue<number>;
  stopFloating?: boolean;
}

export const PhoneMockup = ({ scrollUp, stopFloating }: PhoneMockupProps) => {
  const [phase, setPhase] = useState<'incoming' | 'missed' | 'reply' | 'app'>('incoming');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('missed'), 3500);
    const timer2 = setTimeout(() => setPhase('reply'), 5000);
    const timer3 = setTimeout(() => setPhase('app'), 7500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  const theme = useMemo(() => ({
    missedBg: "#FEE2E2",
    missedColor: "#EF4444",
    successBg: "#DCFCE7",
    successColor: "#22C55E",
  }), []);

  return (
    <div className="flex items-center justify-center py-10 lg:py-0">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative perspective-1000"
      >
        <motion.div
          animate={stopFloating ? { y: 0 } : { y: [0, -15, 0] }}
          transition={stopFloating ? { duration: 0.5 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto border-[8px] border-white/40 bg-white/20 rounded-[3.5rem] h-[660px] w-[330px] flex flex-col overflow-hidden shadow-2xl"
          style={{ 
            boxShadow: `0 30px 60px -15px rgba(174, 165, 183, 0.5), inset 0 0 4px rgba(255,255,255,0.8)`,
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          {/* Bezel */}
          <div className="absolute inset-0 rounded-[3rem] border-[6px] border-[#1a1a1a]/5 pointer-events-none z-50" />
          
          {/* Dynamic Island */}
          <div className="absolute top-5 inset-x-0 z-[60] flex justify-center pointer-events-none" style={{ transform: "translateZ(10px)" }}>
            <div className="h-8 w-28 bg-[#1a1a1a] border border-white/10 rounded-full shadow-lg flex items-center justify-end pr-3 gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/80 shadow-inner" />
                 <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/50" />
            </div>
          </div>

          {/* SCREEN CONTAINER */}
          <div className="h-full w-full relative overflow-hidden bg-white">
            
            {/* --- WALLPAPER: CSS GRADIENT (Lag-Free & Purple Style) --- */}
            {/* This replaces the image with a pure CSS gradient that matches the Hero style */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: `
                        radial-gradient(circle at 0% 0%, #c9bed3 0%, rgba(255,255,255,0) 60%),
                        radial-gradient(circle at 100% 100%, #e9d5ff 0%, rgba(255,255,255,0) 40%),
                        linear-gradient(to bottom, #ffffff 30%, #f3f0f5 100%)
                    `,
                }} 
            />
            {/* Subtle animated sheen to keep it "alive" without heavy cost */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)] bg-[length:200%_200%] animate-shine opacity-30" />

            <style>{`
                @keyframes shine {
                    0% { background-position: 100% 100%; }
                    100% { background-position: 0% 0%; }
                }
                .animate-shine {
                    animation: shine 8s linear infinite;
                }
            `}</style>

            {/* Glossy sheen */}
            <div className="absolute top-0 right-0 w-full h-[400px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10" />

            {/* Status Bar */}
            <div className={`absolute top-7 left-6 right-6 flex justify-between items-center text-[10px] font-bold z-[55] tracking-wide transition-colors duration-500 ${phase === 'app' ? 'text-black/60' : 'text-[#1A1A1A]/60'}`}>
              <span>9:41</span>
              <div className="flex gap-1"><div className="w-4 h-2.5 border-[1.5px] border-current rounded-[3px]" /></div>
            </div>

            {/* --- 1. NOTIFICATIONS CONTAINER (Scrolls Up) --- */}
            <motion.div 
                style={{ y: scrollUp }} 
                className="absolute inset-0 z-20 flex flex-col pt-16 px-6 will-change-transform"
            >
              <AnimatePresence mode="wait">
                
                {/* INCOMING CALL */}
                {phase === 'incoming' && (
                  <motion.div
                    key="incoming"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col pt-8"
                  >
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center shadow-sm mb-4">
                            <span className="text-4xl">👤</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">Potential Client</h2>
                        <p className="text-sm text-[#1A1A1A]/60 font-medium">Mobile...</p>
                    </div>

                    <div className="mt-auto pb-32 flex justify-between px-4 items-center w-full">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                <PhoneOff className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-xs font-bold text-[#1A1A1A]/70">Decline</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <motion.div 
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                            >
                                <PhoneIncoming className="w-8 h-8 text-white" />
                            </motion.div>
                            <span className="text-xs font-bold text-[#1A1A1A]/70">Accept</span>
                        </div>
                    </div>
                  </motion.div>
                )}

                {/* NOTIFICATIONS */}
                {(phase === 'missed' || phase === 'reply') && (
                   <motion.div
                     key="notifications"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="space-y-4 pt-4"
                   >
                     {/* Missed Call */}
                     <div className="w-full bg-white/80 rounded-2xl p-4 shadow-sm ring-1 ring-white/40">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.missedBg }}>
                            <Phone className="w-5 h-5" style={{ color: theme.missedColor, fill: theme.missedColor }} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#1A1A1A] leading-none">Missed Call</h4>
                            <p className="text-xs text-[#1A1A1A]/60 mt-1">Potential Client</p>
                          </div>
                          <span className="ml-auto text-[10px] text-[#1A1A1A]/40 font-medium">1m ago</span>
                        </div>
                      </div>

                      {/* Auto-Reply Bubble */}
                      {phase === 'reply' && (
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-full bg-white/90 rounded-2xl p-4 shadow-lg ring-1 ring-white/60"
                          >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.successBg }}>
                                        <Plus className="w-5 h-5" style={{ color: theme.successColor }} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1A1A1A] leading-none">Auto-Reply Sent</h4>
                                        <p className="text-xs text-[#1A1A1A]/60 mt-1">Text sent to (860) 555-0123</p>
                                    </div>
                                    <span className="ml-auto text-[10px] text-[#1A1A1A]/40 font-medium">now</span>
                                </div>
                                <div className="bg-white/50 rounded-xl p-3 text-xs text-[#1A1A1A]/80 font-medium leading-relaxed border border-white/20">
                                  "Hey, sorry I can't answer the phone right now. How can I help you?"
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                                         <ArrowUp className="w-2 h-2 text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold" style={{ color: theme.successColor }}>Lead Captured</span>
                                </div>
                            </div>
                        </motion.div>
                      )}
                   </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 2. APP CONTAINER --- */}
            <AnimatePresence>
                {phase === 'app' && (
                  <motion.div
                    key="app-wrapper"
                    style={{ y: scrollUp }} 
                    className="absolute inset-0 z-30 will-change-transform"
                  >
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="flex flex-col h-full"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-black/5 bg-white/60 px-6 pt-14">
                            <div className="flex items-center gap-1 text-[#34C759]">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-[15px] leading-none pb-0.5">Back</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs mb-1 text-gray-500 overflow-hidden shadow-inner">
                                    <span className="text-sm">👤</span>
                                </div>
                                <span className="text-[10px] font-medium text-black/70">Potential Client</span>
                            </div>
                            <div className="flex gap-4 opacity-50">
                                <Video className="w-5 h-5 text-[#c9bed3]" />
                                <PhoneIcon className="w-5 h-5 text-[#c9bed3]" />
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar pb-4 pt-4 px-6">
                            <div className="text-center text-[9px] text-gray-400 font-medium py-2">Today 9:41 AM</div>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="self-end max-w-[85%] bg-[#34C759] text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-[13px] leading-snug shadow-sm"
                            >
                                Hey, sorry I can't answer the phone right now. How can I help you?
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.0 }}
                                className="self-start max-w-[85%] bg-[#E9E9EB] text-black px-3.5 py-2 rounded-2xl rounded-tl-sm text-[13px] leading-snug"
                            >
                                No problem. Do you have any openings for a quote tomorrow?
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 2.0 }}
                                className="self-end max-w-[85%] bg-[#34C759] text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-[13px] leading-snug shadow-sm"
                            >
                                Yes! I have a opening at 2:00 PM available. Would that work?
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 3.0 }}
                                className="self-start max-w-[85%] bg-[#E9E9EB] text-black px-3.5 py-2 rounded-2xl rounded-tl-sm text-[13px] leading-snug"
                            >
                                Perfect. See you then.
                            </motion.div>
                            
                            <div className="self-end text-[9px] text-gray-400 font-medium mr-1 opacity-100">
                                Read 9:43 AM
                            </div>
                        </div>

                        {/* Input Bar */}
                        <div className="mt-auto mb-6 flex items-center gap-2 px-6 pt-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200/50 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 h-9 rounded-full border border-gray-200/50 bg-white/60 flex items-center px-3 text-[13px] text-gray-400">
                                iMessage
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center shadow-sm">
                                <ArrowUp className="w-4 h-4 text-white stroke-[3px]" />
                            </div>
                        </div>
                      </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* --- FIXED DOCK (Home Screen Only) --- */}
            <AnimatePresence>
                {phase !== 'app' && (
                    <motion.div 
                        initial={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-4 right-4 bg-white/20 backdrop-blur-md rounded-[24px] h-16 flex justify-around items-center px-2 shadow-sm ring-1 ring-white/30 z-30"
                    >
                        {[1,2,3,4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-xl bg-white/40 hover:bg-white/60 transition-all duration-300" />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Home Indicator */}
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-1 rounded-full z-[60] transition-colors duration-500 ${phase === 'app' ? 'bg-black/80' : 'bg-[#1A1A1A]/20'}`} />
          </div>

          {/* Hardware Buttons */}
          <div className="absolute -right-[8px] top-36 h-16 w-[4px] bg-white/40 rounded-r-md" />
          <div className="absolute -left-[8px] top-32 h-8 w-[4px] bg-white/40 rounded-l-md" />
          <div className="absolute -left-[8px] top-48 h-14 w-[4px] bg-white/40 rounded-l-md" />
        </motion.div>
      </motion.div>
    </div>
  );
};