"use client";
import { BookOpen, Edit } from 'lucide-react';

export default function AdminRules() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#FF6A00]" />
            Rulebook Editor
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Modify the Standard Operating Procedures.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]">
          <span className="transform skew-x-10 flex items-center gap-2">
            <Edit className="w-5 h-5" /> Edit Rulebook
          </span>
        </button>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-8 text-center text-[#B8C0C2]">
        <BookOpen className="w-12 h-12 text-[#FF6A00]/50 mx-auto mb-4" />
        <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">Editor Locked</h3>
        <p className="font-inter text-sm max-w-md mx-auto">
          The markdown rulebook editor will be integrated here, allowing you to globally update the rules shown on the user dashboard.
        </p>
      </div>
    </div>
  );
}