import { Phone, Twitter, Linkedin, Github, ArrowRight, CheckCircle2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-[#111] text-white overflow-hidden pt-24 pb-12">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">Call Backer</span>
            </div>
            
            <p className="text-neutral-400 leading-relaxed max-w-sm">
              The AI-powered receptionist built for trade businesses. Stop missing calls. Start booking more jobs.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'Common Questions'].map((item) => (
                <li key={item}>
                  <a href="/Pricing" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="/" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6">
          <p className="text-neutral-500 text-sm">
            © 2026 Call Backer Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <SocialLink icon={Twitter} href="" />
            <SocialLink icon={Linkedin} href="https://www.linkedin.com/in/owen-garabedian/" />
            <SocialLink icon={Github} href="https://github.com/OwenGarabedian" />
          </div>
        </div>
      </div>

      {/* Massive Background Text (Watermark) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none">
        <h1 className="text-[18vw] font-bold text-white/[0.02] leading-none text-center tracking-tighter whitespace-nowrap translate-y-[20%]">
          CALL BACKER
        </h1>
      </div>

    </footer>
  );
};

const SocialLink = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
  >
    <Icon className="w-4 h-4" />
  </a>
);