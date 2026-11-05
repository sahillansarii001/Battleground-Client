import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080A0C] pt-16 pb-8 border-t border-[#FF6A00]/20 relative overflow-hidden no-print">
      {/* HUD lines in footer */}
      <div className="absolute top-0 left-10 w-px h-full bg-white/5 pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-px h-full bg-white/5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tight text-white flex items-center gap-3 mb-6">
              <img src="/BattlegroundLogo.png" alt="Battlegrounds" className="h-10 w-auto md:h-12 object-contain" />
            </Link>
            <p className="text-[#B8C0C2] max-w-md font-inter text-sm leading-relaxed">
              The ultimate competitive platform for BGMI esports. Built for tactical supremacy and professional tournament management.
            </p>
          </div>
          <div>
            <h4 className="text-white font-orbitron text-[11px] font-bold uppercase tracking-widest mb-6">System</h4>
            <ul className="space-y-4 font-rajdhani text-lg">
              <li><Link href="/#matches" className="text-[#B8C0C2] hover:text-white transition-colors uppercase tracking-wider">Matches</Link></li>
              <li><Link href="/#leaderboard" className="text-[#B8C0C2] hover:text-white transition-colors uppercase tracking-wider">Rankings</Link></li>
              <li><Link href="/rules" className="text-[#B8C0C2] hover:text-white transition-colors uppercase tracking-wider">Rulebook</Link></li>
              <li><Link href="/privacy-policy" className="text-[#B8C0C2] hover:text-[#FF6A00] transition-colors uppercase tracking-wider text-base">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#B8C0C2] hover:text-[#FF6A00] transition-colors uppercase tracking-wider text-base">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-orbitron text-[11px] font-bold uppercase tracking-widest mb-6">Comms</h4>
            <ul className="space-y-4 font-rajdhani text-lg">
              <li><Link href="/support" className="text-[#B8C0C2] hover:text-white transition-colors uppercase tracking-wider">Support</Link></li>
              <li><Link href="/faq" className="text-[#B8C0C2] hover:text-white transition-colors uppercase tracking-wider">FAQ</Link></li>
              <li><Link href="/login" className="text-[#B8C0C2] hover:text-[#FF6A00] transition-colors uppercase tracking-wider">Squad Auth</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} BATTLEGROUNDS PLATFORM.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#39B54A] rounded-full"></span>
            SYSTEM ONLINE
          </div>
        </div>
      </div>
    </footer>
  );
}

