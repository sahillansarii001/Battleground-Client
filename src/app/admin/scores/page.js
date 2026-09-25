"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, Calculator, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminScores() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      if (res.success) {
        setMatches(res.data.filter(m => m.status === 'COMPLETED'));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center justify-between hud-border relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#FF6A00]" />
            Scoreboard Management
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Input match results to automatically update global rankings.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-white p-10 text-center">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
            <Calculator className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
          </div>
          <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Matches to Score</h3>
          <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
            Generate and complete matches in the Match Control panel before inputting scores here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {matches.map(match => (
            <div key={match._id} className="bg-[#111518]/90 border border-white/10 p-6 flex justify-between items-center group">
              <div>
                <h3 className="font-rajdhani text-xl font-bold text-white uppercase">{match.matchName}</h3>
                <p className="font-orbitron text-[10px] text-[#B8C0C2] uppercase mt-1">
                  Status: {match.resultStatus || 'PENDING SCORES'}
                </p>
              </div>
              <button 
                onClick={() => router.push(`/admin/matches/${match._id}/results`)}
                className="bg-[#1A2023] hover:bg-[#FF6A00] text-white hover:text-black font-rajdhani font-bold px-6 py-2 uppercase tracking-widest flex items-center gap-2 transition-colors transform skew-x-[-10deg]"
              >
                <span className="transform skew-x-10 flex items-center gap-2">Manage Scores <ChevronRight className="w-4 h-4" /></span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
