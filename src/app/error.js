"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080A0C] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6A00]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#111518]/90 border border-white/10 p-8 text-center relative z-10 hud-border shadow-2xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-[#FF6A00]" />
        </div>

        <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wider text-white mb-2">
          Signal Interrupted
        </h2>
        <p className="font-inter text-xs text-[#B8C0C2] leading-relaxed mb-6">
          The tactical portal encountered a connection anomaly while loading this module. Please reload to sync latest telemetry or return to base.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-white text-black px-5 py-2.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Module</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Base</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
