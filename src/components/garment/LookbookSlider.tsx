import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LookbookSlider: React.FC = () => {
  const lookbookItems = [
    {
      title: 'Royal Sheger Collection',
      season: 'Autumn / Winter 2026',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
      tag: 'Handspun Habesha Silk'
    },
    {
      title: 'Executive Ethio-Bespoke',
      season: 'Corporate Uniform Suite',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
      tag: 'Hospitality & Aviation'
    },
    {
      title: 'Heritage Mini-Me',
      season: 'Family Celebration Line',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
      tag: 'Pure Cotton Embroidery'
    }
  ];

  return (
    <div className="bg-[#FFFBF7] dark:bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8 border-t border-amber-200/50 dark:border-white/10 relative overflow-hidden">
      
      {/* Signature Element: Fabric Thread SVG in Sand */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-12 text-[#B83E10] dark:text-[#D4B896]">
          <path d="M0,60 C300,120 600,0 900,90 C1050,135 1150,15 1200,60" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B83E10] dark:text-[#C84B1A]">Visual Editorial</span>
          <h2 className="text-2xl sm:text-4xl font-cormorant font-bold text-slate-900 dark:text-[#F5EEE4] mt-1">B-VIBE Fashion Lookbook</h2>
        </div>
        <div className="text-xs text-[#785A28] dark:text-[#D4B896] hidden sm:block">Scroll Horizontally →</div>
      </div>

      {/* Scroll Snap Gallery */}
      <div className="flex gap-6 overflow-x-auto pb-6 scroll-snap-x snap-mandatory no-scrollbar">
        {lookbookItems.map((item, idx) => (
          <div
            key={idx}
            className="snap-center shrink-0 w-[85vw] sm:w-[500px] h-[380px] relative rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 group shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
            
            {/* High-contrast, clean overlay card */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 dark:bg-black/80 backdrop-blur-md rounded-xl border border-amber-200/60 dark:border-white/20 shadow-xl transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B83E10] dark:text-[#C84B1A]">{item.tag}</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5EEE4]">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-[#8A9AAF] mt-0.5">{item.season}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
