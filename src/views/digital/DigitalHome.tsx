'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CaseStudyCard } from '@/components/digital/CaseStudyCard';
import { ServiceConfigurator } from '@/components/digital/ServiceConfigurator';
import { BeforeAfterSlider } from '@/components/digital/BeforeAfterSlider';
import { initialCaseStudies } from '@/data/mockData';
import { CaseStudy } from '@/types';

interface DigitalHomeProps {
  caseStudies?: CaseStudy[];
}

export const DigitalHome: React.FC<DigitalHomeProps> = ({ caseStudies = initialCaseStudies }) => {
  return (
    <main data-division="tx" className="bg-[#060810] text-[#F8FAFC] min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-gradient-to-b from-[#060810] via-[#0D1322] to-[#060810] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#06D6A0] text-xs font-mono-code">
            <Sparkles className="w-4 h-4 text-[#2563EB]" /> Tˣ Digital Media Agency · Addis Ababa
          </div>

          <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-[#F8FAFC] tracking-tight">
            High-Growth Performance Marketing. <br />
            <span className="text-[#2563EB]">Omnichannel Campaigns & Generative AI Assets.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#8A9AAF] max-w-2xl mx-auto font-jakarta leading-relaxed">
            Tˣ accelerates enterprise market share across Ethiopia and East Africa through localized TikTok campaigns, Telegram growth engines, and high-converting performance media.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/digital/packages"
              className="px-8 py-3.5 bg-[#2563EB] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#2563EB]/90 shadow-xl shadow-[#2563EB]/20 flex items-center gap-2"
            >
              Build Agency Package <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/digital/portfolio"
              className="px-8 py-3.5 border border-[#2563EB]/40 text-[#F8FAFC] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              View Client Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Transformation Before/After Slider */}
      <section className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center">
          <span className="text-xs uppercase font-mono-code text-[#06D6A0]">Interactive Transformation</span>
          <h2 className="text-2xl sm:text-3xl font-cormorant font-bold text-[#F8FAFC] mt-1">
            Rebranding Ethio-Enterprise Digital Presence
          </h2>
        </div>
        <BeforeAfterSlider
          beforeImage="https://images.unsplash.com/photo-1542744094-3a3121699964?auto=format&fit=crop&w=1200&q=80"
          afterImage="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
          beforeLabel="Legacy Static Brand"
          afterLabel="Tˣ Dynamic Omnichannel"
        />
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-mono-code text-[#2563EB]">Track Record</span>
            <h2 className="text-2xl sm:text-4xl font-cormorant font-bold text-[#F8FAFC] mt-1">Verified Client Campaign Records</h2>
          </div>
          <Link href="/digital/portfolio" className="text-xs font-bold text-[#06D6A0] flex items-center gap-1">
            All Case Studies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.slice(0, 2).map(cs => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))}
        </div>
      </section>

      {/* Interactive Scope & Package Configurator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D1322] border-t border-white/10">
        <ServiceConfigurator />
      </section>

    </main>
  );
};
