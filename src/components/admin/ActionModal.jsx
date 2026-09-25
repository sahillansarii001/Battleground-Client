import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ActionModal({ isOpen, onClose, title, message, requireInput, inputPlaceholder, confirmText, isDanger, onConfirm, isAlert }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(requireInput ? inputValue : undefined);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111518] border border-white/10 w-full max-w-md shadow-2xl relative flex flex-col">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-0">
          <h2 className="font-rajdhani text-xl font-bold text-white tracking-widest uppercase">{title}</h2>
          <p className="text-[#B8C0C2] mt-2 text-sm">{message}</p>
        </div>

        {requireInput && (
          <div className="p-6 pb-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
          </div>
        )}

        <div className="p-6 flex justify-end gap-3 mt-2">
          {!isAlert && (
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
              isDanger 
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50' 
                : 'bg-[#FF6A00]/20 text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white border border-[#FF6A00]/50'
            }`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
