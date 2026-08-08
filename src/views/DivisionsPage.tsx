'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, Sparkles, Building2, GraduationCap } from 'lucide-react';
import { TripleBarDivider } from '@/components/corporate/TripleBarDivider';

export const DivisionsPage: React.FC = () => {
  return (
    <main data-division="corporate" className="bg-[#080A0F] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8961E]">Division Directory</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC] mt-2">Commercial Operations</h1>
          <TripleBarDivider className="my-6" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Garment */}
          <div className="bg-[#0A0A0A] border border-[#C84B1A]/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#C84B1A] flex items-center gap-1.5">
                <Shirt className="w-4 h-4" /> Division 01 — Retail & B2B
              </span>
              <h2 className="text-2xl font-cormorant font-bold text-[#F5EEE4]">B-VIBE Garment Manufacturing</h2>
              <p className="text-xs text-[#8A9AAF] max-w-xl">
                Bespoke Ethiopian Habesha apparel, corporate hotel/airline uniform suites, leather goods, and automated volume tier wholesale export.
              </p>
            </div>
            <Link
              href="/garment"
              className="px-6 py-3 bg-[#C84B1A] text-white font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 hover:bg-[#C84B1A]/90"
            >
              Explore Division Portal →
            </Link>
          </div>

          {/* Digital */}
          <div className="bg-[#060810] border border-[#2563EB]/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#2563EB] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Division 02 — Creative Agency
              </span>
              <h2 className="text-2xl font-cormorant font-bold text-[#F8FAFC]">Tˣ Digital Marketing & Branding</h2>
              <p className="text-xs text-[#8A9AAF] max-w-xl">
                Brand identity, performance marketing, TikTok/Telegram growth campaigns, digital skills workshops, and AI generative creative pipelines.
              </p>
            </div>
            <Link
              href="/digital"
              className="px-6 py-3 bg-[#2563EB] text-white font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 hover:bg-[#2563EB]/90"
            >
              Explore Division Portal →
            </Link>
          </div>

          {/* Consulting & Training */}
          <div className="bg-[#0C1420] border border-[#C8961E]/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 doc-fold-corner">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#C8961E] flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Division 03 — Advisory & Training
              </span>
              <h2 className="text-2xl font-cormorant font-bold text-[#F0EDE8]">Consulting & Training</h2>
              <p className="text-xs text-[#8A9AAF] max-w-xl">
                Enterprise strategy, textile-industry advisory, environmental/EIA services, FDI regulatory guidance, technical vocational training, and corporate capacity building.
              </p>
            </div>
            <Link
              href="/consulting"
              className="px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 hover:bg-[#C8961E]/90"
            >
              Explore Division Portal →
            </Link>
          </div>

          {/* Branding */}
          <div className="bg-[#081814] border border-[#06D6A0]/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#06D6A0] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Division 04 — Branding & Promotion
              </span>
              <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Branding & Promotion</h2>
              <p className="text-xs text-[#8A9AAF] max-w-xl">
                Brand strategy, corporate identity design, promotional campaign creation, collateral production, and event promotional activation.
              </p>
            </div>
            <Link
              href="/branding"
              className="px-6 py-3 bg-[#06D6A0] text-[#080A0F] font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 hover:bg-[#06D6A0]/90"
            >
              Explore Division Portal →
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
};
