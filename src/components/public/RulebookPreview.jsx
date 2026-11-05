"use client";
import { useState, useEffect } from "react";
import { BookOpen, Shield, Smartphone, AlertOctagon, Radio, ChevronRight } from "lucide-react";
import Link from 'next/link';
import api from '@/lib/api';

export default function RulebookPreview() {
  const [rulebook, setRulebook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRulebook();
  }, []);

  const fetchRulebook = async () => {
    try {
      const res = await api.get('/rules/current');
      if (res?.success) {
        setRulebook(res.data);
      }
    } catch (error) {
      console.warn('Notice: Failed to fetch rulebook preview', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-10 font-rajdhani text-xl">
        Loading Protocol Directives...
      </div>
    );
  }

  return (
    <div className="bg-[#111518]/95 border border-[#FF6A00]/50 p-6 sm:p-8 border-l-4 border-l-[#FF6A00] max-w-4xl mx-auto hud-border shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
        <h3 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#FF6A00]" />
          Tournament Directives
        </h3>
        <span className="font-orbitron text-xs text-[#FF6A00] uppercase font-bold bg-[#080A0C] border border-[#FF6A00]/30 px-2.5 py-1 self-start sm:self-auto">
          Protocol Suite v1.0 — 14.0
        </span>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#080A0C] border border-white/10 p-4">
          <div className="flex items-center gap-2 text-[#FF6A00] font-orbitron text-xs font-bold uppercase mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Only</span>
          </div>
          <p className="text-xs text-[#B8C0C2] font-inter">
            No iPads, tablets, or emulators. Strict registered account validation.
          </p>
        </div>

        <div className="bg-[#080A0C] border border-red-500/30 p-4">
          <div className="flex items-center gap-2 text-red-500 font-orbitron text-xs font-bold uppercase mb-1">
            <AlertOctagon className="w-4 h-4" />
            <span>Zero Tolerance</span>
          </div>
          <p className="text-xs text-[#B8C0C2] font-inter">
            Any hacks, config tools, or scripts lead to immediate permanent ban.
          </p>
        </div>

        <div className="bg-[#080A0C] border border-white/10 p-4">
          <div className="flex items-center gap-2 text-[#39B54A] font-orbitron text-xs font-bold uppercase mb-1">
            <Radio className="w-4 h-4" />
            <span>Slot Adherence</span>
          </div>
          <p className="text-xs text-[#B8C0C2] font-inter">
            Squads must remain in designated bootcamps until match completion.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#B8C0C2] font-inter text-center sm:text-left">
          Review all 14 mandatory sections before tournament room deployment.
        </p>

        <Link 
          href="/rules" 
          className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black px-6 py-2.5 font-rajdhani font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-[#FF6A00]/20"
        >
          <span>View Complete 14 Directives</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
