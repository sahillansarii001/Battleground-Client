"use client";
import { useState } from 'react';
import { Swords, Clock, Target, Trophy } from 'lucide-react';

export default function Matches() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="space-y-6">
      {/* Filters/Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-rajdhani text-lg font-bold tracking-widest uppercase transition-colors ${activeTab === 'upcoming' ? 'text-[#FF6A00] border-b-2 border-[#FF6A00]' : 'text-[#B8C0C2] hover:text-white'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-rajdhani text-lg font-bold tracking-widest uppercase transition-colors ${activeTab === 'past' ? 'text-[#FF6A00] border-b-2 border-[#FF6A00]' : 'text-[#B8C0C2] hover:text-white'}`}
        >
          Past Results
        </button>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-12 flex flex-col items-center justify-center text-center transition-all duration-300">
        {activeTab === 'upcoming' ? (
          <>
            <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
              <Swords className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Scheduled Drops</h3>
            <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
              Tournament brackets have not been generated yet. Await further instructions from high command.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#080A0C] border border-white/10 flex items-center justify-center mb-4 transform skew-x-[-10deg]">
              <Trophy className="w-8 h-8 text-[#B8C0C2] transform skew-x-10 opacity-50" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest mb-2">No Past Records Found</h3>
            <p className="font-inter text-[#B8C0C2] max-w-md mx-auto">
              Your squad hasn't completed any official deployments yet. Participate in matches to see results here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}