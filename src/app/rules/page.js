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
      if (res.success) {
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
            <div className="space-y-10">
              <section className="relative pl-8 border-l-2 border-[#FF6A00]">
                <div className="absolute -left-2.75 top-1 w-5 h-5 bg-[#080A0C] border-2 border-[#FF6A00] flex items-center justify-center transform rotate-45">
                  <span className="font-orbitron text-[8px] text-[#FF6A00] transform -rotate-45 font-bold">01</span>
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                  General Guidelines
                </h3>
                <p className="font-inter text-[#B8C0C2] leading-relaxed">
                  All teams must maintain a high level of professionalism. Any form of cheating, hacking, exploiting glitches, or stream sniping will result in an immediate and permanent ban. Teams are responsible for their own internet connections.
                </p>
              </section>

              <section className="relative pl-8 border-l-2 border-[#FF6A00]">
                <div className="absolute -left-2.75 top-1 w-5 h-5 bg-[#080A0C] border-2 border-[#FF6A00] flex items-center justify-center transform rotate-45">
                  <span className="font-orbitron text-[8px] text-[#FF6A00] transform -rotate-45 font-bold">02</span>
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                  Registration & Eligibility
                </h3>
                <p className="font-inter text-[#B8C0C2] leading-relaxed">
                  Teams must consist of exactly the number of players specified by their team type (Solo = 1, Duo = 2, Squad = 4). Roster changes are not permitted once a tournament stage has commenced without admin approval.
                </p>
              </section>

              <section className="relative pl-8 border-l-2 border-[#FF6A00]">
                <div className="absolute -left-2.75 top-1 w-5 h-5 bg-[#080A0C] border-2 border-[#FF6A00] flex items-center justify-center transform rotate-45">
                  <span className="font-orbitron text-[8px] text-[#FF6A00] transform -rotate-45 font-bold">03</span>
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                  Match Procedures
                </h3>
                <p className="font-inter text-[#B8C0C2] leading-relaxed">
                  Room IDs and Passwords will be shared through the Team Panel exactly 15 minutes before the match start time. Teams failing to join the lobby before the start time will forfeit their placement.
                </p>
              </section>

              <section className="relative pl-8 border-l-2 border-[#FF6A00]">
                <div className="absolute -left-2.75 top-1 w-5 h-5 bg-[#080A0C] border-2 border-[#FF6A00] flex items-center justify-center transform rotate-45">
                  <span className="font-orbitron text-[8px] text-[#FF6A00] transform -rotate-45 font-bold">04</span>
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                  Scoring Matrix
                </h3>
                <div className="bg-white/5 border border-white/10 p-5 mt-4">
                  <p className="font-inter text-[#B8C0C2] mb-4">
                    Standard competitive point systems apply. Points are distributed as follows:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-orbitron text-[10px] tracking-widest text-white uppercase">
                    <div className="bg-[#111518] p-3 border border-white/5 text-center"><span className="text-[#FF6A00] block text-xl mb-1">10</span> WWCD (1st)</div>
                    <div className="bg-[#111518] p-3 border border-white/5 text-center"><span className="text-white block text-xl mb-1">6</span> 2nd Place</div>
                    <div className="bg-[#111518] p-3 border border-white/5 text-center"><span className="text-white block text-xl mb-1">5</span> 3rd Place</div>
                    <div className="bg-[#111518] p-3 border border-[#39B54A]/30 text-center"><span className="text-[#39B54A] block text-xl mb-1">1</span> Per Kill</div>
                  </div>
                </div>
              </section>
              
              <section className="bg-red-950/20 border border-red-500/20 p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-500 to-transparent"></div>
                <h3 className="font-rajdhani text-2xl font-bold text-red-500 mb-2 flex items-center gap-3 uppercase">
                  <AlertOctagon className="w-6 h-6" /> Disqualification Criteria
                </h3>
                <p className="font-inter text-red-200/70 text-sm">
                  Using third-party plugins, triggers, emulators, or playing on iPads during mobile-only tournaments will result in immediate disqualification of the entire squad.
                </p>
              </section>
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
