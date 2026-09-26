"use client";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import Link from 'next/link';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';

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
      console.error('Failed to fetch rulebook', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-10 font-rajdhani text-xl">
        Loading Protocol...
      </div>
    );
  }

  if (!rulebook || !rulebook.content) {
    return null; // Don't show the section if there are no rules
  }

  return (
    <div className="bg-[#111518]/90 border border-[#FF6A00]/50 p-8 border-l-4 border-l-[#FF6A00] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#FF6A00]" />
          {rulebook.title || 'Official Rulebook'}
        </h3>
        <span className="font-orbitron text-xs text-[#B8C0C2] uppercase">Version: {rulebook.version}</span>
      </div>
      <div className="font-inter text-[#B8C0C2] max-h-96 overflow-y-auto custom-scrollbar pr-4">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-rajdhani text-white font-bold uppercase mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-rajdhani text-white font-bold uppercase mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-rajdhani text-[#FF6A00] font-bold uppercase mt-5 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-4 text-[#B8C0C2] leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-[#B8C0C2] space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-[#B8C0C2] space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="" {...props} />,
            strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#FF6A00] pl-4 italic bg-white/5 py-2 my-4" {...props} />
          }}
        >
          {rulebook.content}
        </ReactMarkdown>
      </div>
      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <Link href="/rules" className="font-orbitron text-[10px] text-[#FF6A00] hover:text-white tracking-widest uppercase transition-colors">
          View Full Rulebook
        </Link>
      </div>
    </div>
  );
}
