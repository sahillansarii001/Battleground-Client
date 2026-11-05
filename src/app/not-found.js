"use client";

import Link from "next/link";
import { AlertTriangle, Home, Shield, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080A0C] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6A00]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-lg w-full bg-[#111518]/90 border border-white/10 p-8 sm:p-10 text-center relative z-10 hud-border shadow-2xl">
        <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-3 py-1 mb-4 text-[#FF6A00] font-orbitron text-[11px] font-bold uppercase tracking-widest">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Error 404 // Coordinate Out of Bounds</span>
        </div>

        <h1 className="font-rajdhani text-5xl sm:text-6xl font-bold uppercase tracking-tight text-white mb-2">
          Sector <span className="text-[#FF6A00]">Unreachable</span>
        </h1>

        <p className="font-inter text-xs sm:text-sm text-[#B8C0C2] leading-relaxed mb-8 max-w-sm mx-auto">
          The requested operational sector does not exist or has been relocated by tournament command.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black px-5 py-2.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Base</span>
          </Link>

          <Link
            href="/rules"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Rulebook</span>
          </Link>

          <Link
            href="/support"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
