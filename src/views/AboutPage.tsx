'use client';

import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import { TripleBarDivider } from '@/components/corporate/TripleBarDivider';

export const AboutPage: React.FC = () => {
  return (
    <main data-division="corporate" className="bg-[#080A0F] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Enterprise Governance</span>
          <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-[#F4F1EC] mt-3">
            Origin & Everlasting Trading PLC
          </h1>
          <p className="font-amharic text-sm text-[#C8961E] mt-2">
            ኦሪጅን እና ኤቨርላስቲንግ ትሬዲንግ ኃ.የተ.የግ.ማ
          </p>
          <TripleBarDivider className="my-6" />
          <p className="text-sm text-[#8A9AAF] max-w-2xl mx-auto font-jakarta leading-relaxed">
            Headquartered in Addis Ababa, Ethiopia, Origin & Everlasting Trading PLC is a multi-sector commercial entity operating at the intersection of industrial garment manufacturing, creative digital media, and management consulting.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-8 space-y-4">
            <Globe className="w-8 h-8 text-[#C8961E]" />
            <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Our Enterprise Vision</h2>
            <p className="text-xs text-[#8A9AAF] leading-relaxed">
              To establish an enduring African enterprise that sets global standards across ethical textile manufacturing, performance digital media, and data-backed management consulting — showcasing Ethiopian innovation to international markets.
            </p>
          </div>

          <div className="bg-[#111318] border border-white/10 rounded-2xl p-8 space-y-4">
            <ShieldCheck className="w-8 h-8 text-[#C84B1A]" />
            <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Operational Mission</h2>
            <p className="text-xs text-[#8A9AAF] leading-relaxed">
              To empower commercial clients through seamless supply chains, hyper-localized performance creative, and transformational enterprise workflows while generating high-value employment across Ethiopia.
            </p>
          </div>
        </div>

        {/* Corporate Leadership & Governance Stats */}
        <div className="bg-[#111318] border border-[#C8961E]/30 rounded-3xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold font-mono-code text-[#C8961E]">3</div>
            <div className="text-xs uppercase text-[#8A9AAF] mt-1">Commercial Divisions</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono-code text-[#C84B1A]">250+</div>
            <div className="text-xs uppercase text-[#8A9AAF] mt-1">Garment Artisans</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono-code text-[#2563EB]">4.2M+</div>
            <div className="text-xs uppercase text-[#8A9AAF] mt-1">Digital Ad Impressions</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono-code text-[#06D6A0]">100%</div>
            <div className="text-xs uppercase text-[#8A9AAF] mt-1">ETB & USD Compliance</div>
          </div>
        </div>

      </div>
    </main>
  );
};
