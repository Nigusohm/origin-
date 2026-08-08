'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { initialCaseStudies } from '@/data/mockData';
import { CaseStudy } from '@/types';

interface DigitalCaseStudyDetailProps {
  slug?: string;
  caseStudies?: CaseStudy[];
}

export const DigitalCaseStudyDetail: React.FC<DigitalCaseStudyDetailProps> = ({ slug, caseStudies = initialCaseStudies }) => {
  const cs = caseStudies.find(item => item.slug === slug) || caseStudies[0];

  return (
    <main data-division="tx" className="bg-[#060810] text-[#F8FAFC] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <Link href="/digital/portfolio" className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#06D6A0]">
          <ArrowLeft className="w-4 h-4" /> Back to Case Studies
        </Link>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {cs.campaign_type.map((tag, i) => (
              <span key={i} className="text-[10px] font-mono-code uppercase px-2.5 py-1 rounded bg-[#2563EB]/20 text-[#06D6A0]">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F8FAFC]">{cs.client_name}</h1>
          <p className="text-sm text-[#8A9AAF] mt-3 font-jakarta leading-relaxed">{cs.brief}</p>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <Image src={cs.cover_image} alt={cs.client_name} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cs.metrics.map((m, i) => (
            <div key={i} className="bg-[#111318] border border-[#2563EB]/30 p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono-code text-[#06D6A0]">
                {m.value} {m.suffix}
              </div>
              <div className="text-[10px] uppercase font-mono-code text-[#8A9AAF] mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Strategy & Results */}
        <div className="bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-cormorant font-bold text-[#F8FAFC]">Campaign Execution & Results</h2>
          <div className="space-y-3 text-xs text-[#8A9AAF] leading-relaxed">
            <p>
              Tx deployed a dual-channel localized strategy combining high-frequency Amharic TikTok short videos with an automated Telegram customer acquisition funnel.
            </p>
            <p>
              Real-time campaign telemetry and attribution dashboards enabled daily bid optimizations, delivering unprecedented brand reach and lowering customer acquisition costs by 42%.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};
