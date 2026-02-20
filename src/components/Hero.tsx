import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { MagneticButton } from "./ui/magnetic-button";
import { useRef, useState } from "react";
import { Zap, TrendingUp, Clock, ArrowUpRight, CheckCircle2, Hammer, HardHat, ShieldCheck, Snowflake, Wrench, Smartphone } from "lucide-react"; 

// --- 1. SHARED ASSETS ---
const LOGOS = [
  { name: "Roofing Assoc", icon: Hammer, color: "text-orange-500" },
  { name: "Trade Masters", icon: HardHat, color: "text-yellow-500" },
  { name: "Secure Home", icon: ShieldCheck, color: "text-emerald-500" },
  { name: "HVAC Alliance", icon: Snowflake, color: "text-cyan-500" },
  { name: "Plumbers Union", icon: Wrench, color: "text-blue-500" },
  { name: "Electric Pros", icon: Zap, color: "text-amber-500" },
];
const MARQUEE_CONTENT = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

const HeroMarquee = () => (
  <div className="flex flex-col items-center justify-end gap-6 md:gap-8 w-full max-w-7xl mx-auto py-6 md:py-10 translate-z-0">
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      <p className="text-[8px] md:text-[9px] font-bold tracking-[0.25em] text-neutral-500 uppercase font-mono">
        Powering Top Trade Businesses
      </p>
    </div>

    <div className="w-full relative overflow-hidden transform-gpu" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
      <motion.div 
        className="flex gap-4 w-max"
        style={{ translateZ: 0, willChange: "transform" }}
        animate={{ x: ["0%", "-33.33%"] }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      >
        {MARQUEE_CONTENT.map((logo, index) => (
          <div key={index} className="group flex items-center gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-neutral-50/50 border border-neutral-200/60 hover:border-neutral-300 hover:bg-white transition-all duration-500">
            <logo.icon className={`w-4 h-4 grayscale group-hover:grayscale-0 transition-all duration-500 ${logo.color}`} strokeWidth={2} />
            <span className="text-xs md:text-sm font-semibold text-neutral-600 group-hover:text-neutral-900 tracking-tight transition-colors">
              {logo.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

const PoshCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/90 backdrop-blur-md rounded-3xl md:rounded-[2rem] p-6 md:p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:bg-white/95 transition-all duration-500 ease-out transform-gpu backface-hidden ${className}`}>
      {children}
  </div>
);

// --- 2. MOBILE NATIVE LAYOUT (Zero Phone Mockup) ---
const MobileHero = () => {
  return (
    <div className="relative w-full bg-[#FAFAFA] flex flex-col items-center pt-28 pb-16 px-4 overflow-hidden lg:hidden">
      {/* Background FX */}
      <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] rounded-full bg-gradient-to-br from-[#E0CCF7] to-transparent opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* Hero Text */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center relative z-10 w-full mb-12">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 bg-white border border-gray-200 shadow-sm mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Automated Lead Capture</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-medium leading-[1.05] tracking-tight mb-5 text-[#111]">
          Turn Missed Calls <br />
          <span className="italic font-serif text-gray-400">Into New Jobs.</span>
        </h1>

        <p className="text-base text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed font-light">
          You're busy on the job site. We're busy on the phone. <strong className="text-gray-900 font-semibold block mt-1">Capture, qualify, and convert leads automatically.</strong>
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <MagneticButton variant="primary" size="lg" className="w-full">Start Capturing Leads</MagneticButton>
          <a href="/Pricing" className="w-full">
             <MagneticButton variant="secondary" size="lg" className="w-full">How It Works</MagneticButton>
          </a>
        </div>
      </motion.div>

      {/* Cards - Elegant Native Scroll Fade */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10 mb-16">
         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
            <PoshCard className="h-full">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><Zap className="w-5 h-5 text-gray-900" strokeWidth={1.5}/></div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded-full">Speed</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-gray-900 tracking-tight mb-2">Zero Delay</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Customers appreciate speed. Our AI responds in 2.5s, targeting leads before they can call your competitors.</p>
                    </div>
                </div>
            </PoshCard>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
            <PoshCard className="h-full">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><Clock className="w-5 h-5 text-gray-900" strokeWidth={1.5} /></div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded-full">Reliability</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-gray-900 tracking-tight mb-2">Always Open</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Whether you're on a roof or at dinner, we ensure every potential customer gets a professional response.</p>
                    </div>
                </div>
            </PoshCard>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
            <PoshCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><TrendingUp className="w-5 h-5 text-gray-900" strokeWidth={1.5} /></div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full border border-green-100"><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Optimization</span></div>
                        </div>
                        <h3 className="text-2xl font-medium text-gray-900 tracking-tight mb-2">Grow Revenue</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Stop leaving money on the table. We automatically re-engage missed calls to book more jobs without extra work.</p>
                    </div>
                    <div className="bg-white/50 border border-white/60 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-end gap-2"><span className="text-4xl font-light text-gray-900 tracking-tighter">30%</span><ArrowUpRight className="w-6 h-6 text-emerald-500 mb-1" /></div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Growth Rate</p>
                    </div>
                </div>
            </PoshCard>
         </motion.div>
      </div>

      {/* Final CTA */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="text-center z-10 w-full mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-purple-100/50 to-blue-100/50 blur-[60px] rounded-full z-[-1]" />
          <h2 className="text-4xl font-semibold text-[#111] tracking-tight leading-[1.1] mb-6">
              Make your phone <br /><span className="italic font-serif text-gray-400">your best employee.</span>
          </h2>
          <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-4">
              <a href="/Pricing" className="w-full">
                  <MagneticButton variant="primary" size="lg" className="w-full bg-[#111] text-white overflow-hidden relative group p-3">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                         Maximize Your Revenue <Smartphone className="w-4 h-4 text-purple-400" />
                      </span>
                  </MagneticButton>
              </a>
              <p className="text-xs text-neutral-400 font-medium">Capture every opportunity</p>
          </div>
      </motion.div>

      {/* Marquee */}
      <div className="w-full mt-4">
         <HeroMarquee />
      </div>
    </div>
  );
};


// --- 3. DESKTOP SCROLL-JACKING LAYOUT (Keeps your 3D effect intact) ---
const DesktopHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 0.15], ["0%", "-40%"]);
  const notificationY = useTransform(scrollYProgress, [0.1, 0.5], [0, -800]); 

  const phoneX = useTransform(scrollYProgress, [0.1, 0.5], ["20vw", "0vw"]); 
  const phoneRotateZ = useTransform(scrollYProgress, [0.1, 0.55], ["0deg", "-90deg"]);
  const phoneRotateY = useTransform(scrollYProgress, [0.1, 0.55], ["-15deg", "0deg"]);
  const phoneScale = useTransform(scrollYProgress, [0.15, 0.55], [1, 5.5]); 
  
  const [isScrolling, setIsScrolling] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof latest === "number") {
      if (latest > 0.01 && !isScrolling) setIsScrolling(true);
      else if (latest <= 0.01 && isScrolling) setIsScrolling(false);
    }
  });

  const c1Opacity = useTransform(scrollYProgress, [0, 0.55, 0.65, 0.8, 0.9], [0, 0, 1, 1, 0]);
  const c1Y = useTransform(scrollYProgress, [0, 0.55, 0.65], [60, 60, 0]); 
  const c1X = useTransform(scrollYProgress, [0, 0.8, 0.9], ["0%", "0%", "-100%"]);
  
  const c2Opacity = useTransform(scrollYProgress, [0, 0.60, 0.70, 0.8, 0.9], [0, 0, 1, 1, 0]);
  const c2Y = useTransform(scrollYProgress, [0, 0.60, 0.70], [60, 60, 0]);
  const c2X = useTransform(scrollYProgress, [0, 0.8, 0.9], ["0%", "0%", "100%"]);
  
  const c3Opacity = useTransform(scrollYProgress, [0, 0.65, 0.75, 0.8, 0.9], [0, 0, 1, 1, 0]);
  const c3Y = useTransform(scrollYProgress, [0, 0.65, 0.75, 0.8, 0.9], [60, 60, 0, 0, 100]);
  const c3Scale = useTransform(scrollYProgress, [0.8, 0.9], [1, 0.9]);

  const finalOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const finalScale = useTransform(scrollYProgress, [0.85, 0.95], [0.95, 1]);
  const finalY = useTransform(scrollYProgress, [0.85, 0.95], [20, 0]);
  const endGradientOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  const socialOpacity = useTransform(scrollYProgress, [0, 0.92, 0.98], [0, 0, 1]);
  const socialY = useTransform(scrollYProgress, [0, 0.92, 0.98], [40, 40, 0]);
  
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8, 0.95], [0, 0, 0.4, 0]); 
  const bigTextOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 0.08]);

  return (
    <div ref={containerRef} className="hidden lg:block relative h-[450vh] bg-[#FAFAFA] font-sans selection:bg-[#1A1A1A] selection:text-white"> 
      <div className="sticky top-0 h-screen overflow-hidden transform-gpu">
        {/* Backgrounds */}
        <div className="absolute inset-0 z-0 bg-[#FAFAFA]">
            <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#E0CCF7] to-transparent opacity-40 blur-3xl transform-gpu pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#D4E4F7] to-transparent opacity-30 blur-3xl transform-gpu pointer-events-none" />
            <motion.div style={{ opacity: endGradientOpacity }} className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-indigo-50/30 z-10 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        </div>
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[#050505] z-0 pointer-events-none" />
        <motion.div style={{ opacity: bigTextOpacity }} className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-[18vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-black to-transparent leading-none tracking-tighter opacity-20">CAPTURE</h1>
            <h1 className="text-[18vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-black to-transparent leading-none tracking-tighter opacity-20">GROWTH</h1>
        </motion.div>

        {/* Hero Entry */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 grid grid-cols-2 items-center pointer-events-none">
            <motion.div style={{ opacity: textOpacity, y: textY, scale: textScale, translateZ: 0 }} className="text-left pointer-events-auto relative">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8 bg-white border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">Automated Lead Capture</span>
                </div>
                <h1 className="text-8xl font-medium leading-[0.95] tracking-tight mb-8 text-[#111]">
                    Turn Missed Calls <br />
                    <span className="italic font-serif text-gray-400">Into New Jobs.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-md mb-10 leading-relaxed font-light">
                    You're busy on the job site. We're busy on the phone. <strong className="text-gray-900 font-semibold block mt-1">Capture, qualify, and convert leads automatically.</strong>
                </p>
                <div className="flex flex-row gap-4 items-center">
                    <MagneticButton variant="primary" size="lg" className="shadow-xl shadow-gray-200/50">Start Capturing Leads</MagneticButton>
                    <a href="/Pricing">
                       <MagneticButton variant="secondary" size="lg">View Pricing</MagneticButton>
                    </a>
                </div>
            </motion.div>
        </div>

        {/* 3D Phone */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 perspective-1000">
          <motion.div style={{ x: phoneX, rotateZ: phoneRotateZ, rotateY: phoneRotateY, scale: phoneScale, translateZ: 0 }} className="origin-center">
               <PhoneMockup scrollUp={notificationY} stopFloating={isScrolling} />
           </motion.div>
        </div>

        {/* Cards */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-5xl px-6 pointer-events-auto">
                <div className="grid grid-cols-2 gap-6 w-full">
                    <motion.div style={{ opacity: c1Opacity, y: c1Y, x: c1X }}><PoshCard><div className="flex flex-col h-full justify-between"><div className="flex justify-between items-start"><div className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><Zap className="w-5 h-5 text-gray-900" /></div><span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded-full">Speed</span></div><div><h3 className="text-2xl font-medium text-gray-900 tracking-tight mb-2">Zero Delay</h3><p className="text-gray-500 text-sm">Customers appreciate speed. Our AI responds in 2.5s.</p></div></div></PoshCard></motion.div>
                    <motion.div style={{ opacity: c2Opacity, y: c2Y, x: c2X }}><PoshCard><div className="flex flex-col h-full justify-between"><div className="flex justify-between items-start"><div className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><Clock className="w-5 h-5 text-gray-900" /></div><span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded-full">Reliability</span></div><div><h3 className="text-2xl font-medium text-gray-900 tracking-tight mb-2">Always Open</h3><p className="text-gray-500 text-sm">Whether you're on a roof or at dinner, we ensure response.</p></div></div></PoshCard></motion.div>
                    <motion.div style={{ opacity: c3Opacity, y: c3Y, scale: c3Scale }} className="col-span-2"><PoshCard className="relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" /><div className="relative z-10 flex flex-row items-end justify-between gap-8 h-full"><div className="max-w-md"><div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gray-50 rounded-2xl border border-gray-100"><TrendingUp className="w-5 h-5 text-gray-900" /></div><div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full border border-green-100"><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Optimization</span></div></div><h3 className="text-3xl font-medium text-gray-900 tracking-tight mb-3">Grow Revenue</h3><p className="text-gray-500 text-base">Stop leaving money on the table. We automatically re-engage missed calls to book more jobs without extra work.</p></div><div className="bg-white/50 border border-white/60 rounded-2xl p-6"><div className="flex items-end gap-2"><span className="text-5xl font-light text-gray-900 tracking-tighter">30%</span><ArrowUpRight className="w-8 h-8 text-emerald-500 mb-2" /></div><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Growth Rate</p></div></div></PoshCard></motion.div>
                </div>
            </div>
        </div>

        {/* Final CTA Reveal */}
        <motion.div style={{ opacity: finalOpacity, scale: finalScale, y: finalY }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-6">
            <div className="text-center max-w-2xl px-6 relative pointer-events-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-purple-100/50 to-blue-100/50 blur-[60px] rounded-full z-[-1] pointer-events-none" />
                <h2 className="text-7xl font-semibold text-[#111] tracking-tight leading-[1.1] mb-8">
                    Make your phone <br /><span className="italic font-serif text-gray-400">your best employee.</span>
                </h2>
                <div className="flex flex-col items-center gap-6">
                    <a href="/Pricing">
                        <MagneticButton variant="primary" size="lg" className="group relative min-w-[260px] overflow-hidden bg-[#111] border border-white/10 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.2)] hover:shadow-[0_20px_50px_-12px_rgba(124,58,237,0.4)] transition-all duration-500 p-3">
                            <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                                <span className="text-lg font-medium tracking-wide">Maximize Your Revenue</span><Smartphone className="w-5 h-5 text-purple-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" strokeWidth={2.5} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </MagneticButton>
                    </a>
                    <p className="text-sm text-neutral-400 font-medium">Capture every opportunity</p>
                </div>
            </div>
        </motion.div>

        {/* Marquee */}
        <motion.div style={{ opacity: socialOpacity, y: socialY }} className="absolute bottom-24 inset-x-0 z-50 pointer-events-none px-6">
             <HeroMarquee />
        </motion.div>
      </div>
    </div>
  );
};

// --- 4. MAIN EXPORT (Renders either Mobile or Desktop based on screen size) ---
export const Hero = () => {
  return (
    <>
      <MobileHero />
      <DesktopHero />
    </>
  );
};