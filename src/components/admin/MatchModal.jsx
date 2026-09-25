import { useState } from 'react';

export default function MatchModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111518] border border-white/10 p-6 w-full max-w-lg">
        <h2 className="text-white font-bold font-rajdhani text-2xl uppercase tracking-widest mb-4">Create Match</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onSubmit(Object.fromEntries(formData));
        }}>
          <div className="space-y-4">
            <div>
              <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Match Number</label>
              <input type="number" name="matchNumber" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Match Name</label>
              <input type="text" name="matchName" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Date</label>
                <input type="date" name="date" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" />
              </div>
              <div>
                <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Time</label>
                <input type="time" name="startTime" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Map</label>
                <select name="map" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white">
                  <option value="ERANGEL">Erangel</option>
                  <option value="MIRAMAR">Miramar</option>
                  <option value="SANHOK">Sanhok</option>
                  <option value="VIKENDI">Vikendi</option>
                </select>
              </div>
              <div>
                <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Mode</label>
                <select name="mode" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white">
                  <option value="SQUAD">Squad</option>
                  <option value="DUO">Duo</option>
                  <option value="SOLO">Solo</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="text-[#B8C0C2] hover:text-white uppercase text-sm font-bold">Cancel</button>
            <button type="submit" className="bg-[#FF6A00] text-black font-bold uppercase tracking-widest px-6 py-2">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
