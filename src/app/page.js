import Link from "next/link";
import { 
  Trophy, Users, Swords, Crosshair, ChevronRight, 
  Map as MapIcon, ArrowRight, Target, Shield, Activity
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 overflow-x-hidden bg-[#080A0C]">
      
      {/* 10. HERO - ESPORTS PORTAL */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          {/* Tactical Grid */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          {/* Lighting */}
          <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-[#FF6A00]/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 mb-8 backdrop-blur-sm hud-border">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse"></span>
              <span className="font-orbitron text-[10px] font-bold text-[#B8C0C2] tracking-[0.2em] uppercase">Battlegrounds Mobile India</span>
            </div>
            
            <h1 className="font-rajdhani text-6xl md:text-8xl font-bold text-white mb-6 leading-[0.9] uppercase tracking-tight">
              Dominate.<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF6A00] to-[#FF7A00]">Survive.</span><br />
              Conquer.
            </h1>
            
            <p className="font-inter mt-4 text-lg text-[#B8C0C2] mb-10 leading-relaxed max-w-xl">
              Enter the ultimate BGMI competitive experience. Build your squad, deploy into the battleground, and fight for the championship title.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center bg-[#FF6A00] px-8 py-4 font-rajdhani text-lg font-bold text-white transition-all hover:bg-white hover:text-black uppercase tracking-widest transform skew-x-[-10deg] shadow-[0_0_20px_rgba(255,106,0,0.3)]"
              >
                <span className="transform skew-x-10 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Join Tournament
                </span>
              </Link>
              <Link
                href="#matches"
                className="group relative inline-flex items-center justify-center bg-[#111518] border border-white/10 px-8 py-4 font-rajdhani text-lg font-bold text-white transition-all hover:bg-white/10 uppercase tracking-widest transform skew-x-[-10deg]"
              >
                <span className="transform skew-x-10 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  View Matches
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating HUD Cards */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4 w-64 z-20">
          <div className="bg-[#111518]/80 backdrop-blur-md border border-white/10 p-4 border-l-2 border-l-[#FF6A00]">
            <div className="font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase mb-1">Status</div>
            <div className="font-rajdhani text-xl font-bold text-white uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#39B54A] rounded-full animate-pulse"></span>
              Registrations Open
            </div>
          </div>
          <div className="bg-[#111518]/80 backdrop-blur-md border border-white/10 p-4 border-l-2 border-l-white/20">
            <div className="font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase mb-1">Prize Pool</div>
            <div className="font-rajdhani text-3xl font-bold text-[#FF6A00] uppercase">₹50,000</div>
          </div>
        </div>
      </section>

      {/* 12. TOURNAMENT STATUS */}
      <section className="bg-[#111518] border-b border-white/5 py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#39B54A]/10 border border-[#39B54A]/30 px-3 py-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#39B54A] rounded-full animate-ping"></span>
                <span className="font-orbitron text-[11px] font-bold text-[#39B54A] tracking-widest uppercase">Live Tournament</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-center md:text-left font-rajdhani">
              <div>
                <div className="text-[10px] text-[#B8C0C2] font-orbitron tracking-widest uppercase">Phase</div>
                <div className="text-lg font-bold text-white uppercase">Qualifiers</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div>
                <div className="text-[10px] text-[#B8C0C2] font-orbitron tracking-widest uppercase">Round</div>
                <div className="text-lg font-bold text-white uppercase">Round 01</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div>
                <div className="text-[10px] text-[#B8C0C2] font-orbitron tracking-widest uppercase">Next Drop</div>
                <div className="text-lg font-bold text-[#FF6A00] uppercase">20:00 IST</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. TOURNAMENT STATISTICS */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Squads', value: '128', icon: Users },
              { label: 'Active Players', value: '512', icon: Crosshair },
              { label: 'Total Matches', value: '48', icon: Swords },
              { label: 'Prize Pool', value: '50K', icon: Trophy },
            ].map((stat, i) => (
              <div key={i} className="bg-[#111518]/50 border border-white/5 p-6 backdrop-blur-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#FF6A00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                  <stat.icon className="w-6 h-6 text-[#B8C0C2] group-hover:text-[#FF6A00] transition-colors" />
                  <span className="font-orbitron text-[10px] text-white/20 tracking-widest">0{i+1}</span>
                </div>
                <div className="font-rajdhani text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. LIVE MATCH CENTER */}
      <section className="py-20 relative bg-[#111518]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-12">
            <h2 className="font-rajdhani text-4xl md:text-5xl font-bold text-white uppercase tracking-tight text-center">
              Live Match <span className="text-[#FF6A00]">Center</span>
            </h2>
            <div className="w-24 h-1 bg-[#FF6A00] mt-4 transform skew-x-[-20deg]"></div>
          </div>
          
          <div className="bg-[#080A0C] border border-white/10 p-6 md:p-10 relative overflow-hidden hud-border">
            {/* Background Texture inside card */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="w-full lg:w-1/3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#39B54A]/10 border border-[#39B54A]/30 px-3 py-1 mb-6">
                  <Activity className="w-4 h-4 text-[#39B54A]" />
                  <span className="font-orbitron text-[11px] font-bold text-[#39B54A] tracking-widest uppercase">In Progress</span>
                </div>
                <h3 className="font-rajdhani text-5xl font-bold text-white mb-2 uppercase">Match 12</h3>
                <p className="font-orbitron text-sm text-[#FF6A00] tracking-widest uppercase flex items-center justify-center lg:justify-start gap-2">
                  <MapIcon className="w-4 h-4" /> Erangel <span className="text-white/20 mx-2">|</span> Squad TPP
                </p>
              </div>
              
              <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Teams Alive', value: '16' },
                  { label: 'Players Alive', value: '62' },
                  { label: 'Phase', value: '4' },
                  { label: 'Time', value: '18:24' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#111518] border border-white/10 p-4 text-center">
                    <div className="font-rajdhani text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* 15. MATCH SCHEDULE */}
      <section id="matches" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div>
              <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-tight">Match Center</h2>
              <p className="font-inter text-[#B8C0C2] mt-2">Upcoming drops and room intelligence.</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button className="bg-[#FF6A00] text-black font-orbitron text-[10px] font-bold px-4 py-2 uppercase tracking-widest transform skew-x-[-10deg]">Upcoming</button>
              <button className="bg-[#111518] text-[#B8C0C2] border border-white/10 hover:text-white font-orbitron text-[10px] font-bold px-4 py-2 uppercase tracking-widest transform skew-x-[-10deg]">Completed</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111518]/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#FF6A00]/50 transition-colors group">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-white/5 border border-white/10 text-[#B8C0C2] font-orbitron text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Scheduled
                  </span>
                  <div className="text-right">
                    <div className="font-rajdhani text-xl font-bold text-white">24 SEP</div>
                    <div className="font-orbitron text-xs text-[#FF6A00] tracking-widest">19:00 IST</div>
                  </div>
                </div>
                
                <h3 className="font-rajdhani text-3xl font-bold text-white mb-2 uppercase">Match 0{i + 12}</h3>
                <p className="font-orbitron text-[11px] text-[#B8C0C2] mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <MapIcon className="w-4 h-4 text-[#FF6A00]" /> Miramar <span className="mx-1 opacity-30">/</span> Squad
                </p>
                
                <button className="w-full py-3 bg-[#1A2023] group-hover:bg-[#FF6A00] text-white group-hover:text-black font-rajdhani font-bold text-lg transition-colors uppercase tracking-widest transform skew-x-[-10deg]">
                  <span className="block transform skew-x-10">View Intel</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. BATTLE RANKINGS */}
      <section id="leaderboard" className="py-20 bg-[#111518]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-tight mb-2">Battle Rankings</h2>
            <div className="w-24 h-1 bg-[#FF6A00] mx-auto transform skew-x-[-20deg]"></div>
          </div>
          
          <div className="bg-[#080A0C] border border-white/10 overflow-hidden hud-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#111518] border-b border-white/10 font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase">
                    <th className="py-4 px-6 w-20">Rank</th>
                    <th className="py-4 px-6">Squad</th>
                    <th className="py-4 px-6 text-center">Matches</th>
                    <th className="py-4 px-6 text-center">WWCD</th>
                    <th className="py-4 px-6 text-center text-[#39B54A]">Place Pts</th>
                    <th className="py-4 px-6 text-center text-red-400">Kill Pts</th>
                    <th className="py-4 px-6 text-right text-[#FF6A00] font-bold text-xs">Total</th>
                  </tr>
                </thead>
                <tbody className="font-rajdhani">
                  {/* Empty state styling */}
                  <tr>
                    <td colSpan="7" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Shield className="w-16 h-16 text-white/5 mb-4" />
                        <h3 className="text-2xl font-bold text-[#B8C0C2] uppercase tracking-widest">Rankings Unlocked Soon</h3>
                        <p className="font-inter text-sm text-[#B8C0C2]/50 mt-2">Standings will populate after the first deployment.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 28. FINAL GAMING CTA */}
      <section className="py-32 relative bg-[#080A0C] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#FF6A00]/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-rajdhani text-5xl md:text-7xl font-bold text-white uppercase tracking-tight mb-4">
            Ready For The <span className="text-[#FF6A00]">Drop?</span>
          </h2>
          <p className="font-orbitron text-sm md:text-base text-[#B8C0C2] mb-12 tracking-widest uppercase">
            Build your squad. Enter the battleground.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/register"
              className="bg-[#FF6A00] hover:bg-white text-black px-10 py-5 font-rajdhani font-bold text-xl uppercase tracking-widest transition-colors shadow-[0_0_30px_rgba(255,106,0,0.4)] transform skew-x-[-10deg]"
            >
              <span className="block transform skew-x-10">Register Team</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 29. FOOTER */}
      <footer className="bg-[#080A0C] pt-16 pb-8 border-t border-[#FF6A00]/20 relative overflow-hidden">
        {/* HUD lines in footer */}
        <div className="absolute top-0 left-10 w-px h-full bg-white/5"></div>
        <div className="absolute top-0 right-10 w-px h-full bg-white/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-3xl font-black tracking-tight text-white flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FF6A00] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="uppercase tracking-widest font-rajdhani">BATTLEGROUNDS</span>
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
              </ul>
            </div>
            <div>
              <h4 className="text-white font-orbitron text-[11px] font-bold uppercase tracking-widest mb-6">Comms</h4>
              <ul className="space-y-4 font-rajdhani text-lg">
                <li><Link href="/contact" className="text-[#B8C0C2] hover:text-white transition-colors uppercase tracking-wider">Support</Link></li>
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
    </main>
  );
}
