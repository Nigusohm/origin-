'use client';

import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';

export const ConsultingInsights: React.FC = () => {
  return (
    <main data-division="consulting" className="bg-[#080A0F] text-[#F0EDE8] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Market Telemetry</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F0EDE8] mt-1">East African Market Analytics</h1>
          <p className="text-xs text-[#8A9AAF] mt-2">Macroeconomic indicators, currency trade liquidity, and sector growth benchmarks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0C1420] border border-white/10 p-8 rounded-3xl space-y-4 doc-fold-corner">
            <BarChart3 className="w-8 h-8 text-[#C8961E]" />
            <h3 className="text-2xl font-cormorant font-bold text-[#F0EDE8]">Garment Export Growth</h3>
            <p className="text-xs text-[#8A9AAF] leading-relaxed">
              Industrial park export volumes across Hawassa, Bole Lemi, and Adama have surged by 28% year-over-year, driven by European duty-free trade corridors.
            </p>
          </div>

          <div className="bg-[#0C1420] border border-white/10 p-8 rounded-3xl space-y-4 doc-fold-corner">
            <PieChart className="w-8 h-8 text-[#2563EB]" />
            <h3 className="text-2xl font-cormorant font-bold text-[#F0EDE8]">Digital Advertising Penetration</h3>
            <p className="text-xs text-[#8A9AAF] leading-relaxed">
              Mobile internet subscriber growth and Telebirr digital wallet adoption have unlocked high-converting social commerce channels on Telegram and TikTok.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
