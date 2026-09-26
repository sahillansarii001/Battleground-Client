"use client";
import { useState, useEffect } from "react";
import { Shield, Download, AlertOctagon, Target } from "lucide-react";
import Link from 'next/link';
import api from '@/lib/api';

export default function Rules() {
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
      console.error('Failed to fetch rulebook', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-32 bg-[#080A0C] relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#FF6A00]/5 rounded-full blur-[120px]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-4 py-1 mb-6">
            <Shield className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">System Protocol</span>
          </div>
          <h1 className="font-rajdhani text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">Tournament <span className="text-[#FF6A00]">Directives</span></h1>
          <p className="font-inter text-[#B8C0C2] max-w-2xl mx-auto">
            Mandatory protocols for all participating squads. Failure to comply results in immediate disqualification from the server.
          </p>
        </div>

        <div className="bg-[#111518]/80 backdrop-blur-md border border-white/10 p-8 md:p-12 relative hud-border">
          
          {loading ? (
            <div className="text-center text-white py-10 font-rajdhani text-xl">Loading Protocol...</div>
          ) : rulebook && rulebook.content ? (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6 mb-6">
                <h3 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">{rulebook.title || 'Official Rulebook'}</h3>
                <span className="font-orbitron text-xs text-[#FF6A00] uppercase">Version: {rulebook.version}</span>
              </div>
              <div className="prose prose-invert prose-orange max-w-none font-inter text-[#B8C0C2]">
                {rulebook.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#111518]/90 border border-white/10 p-12 text-center text-[#B8C0C2] font-rajdhani text-xl tracking-widest uppercase mb-8">
              No official rulebook has been published by the admins yet.
            </div>
          )}
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase">
              By initializing deployment, you accept these terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
