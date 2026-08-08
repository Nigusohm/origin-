'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { CaseStudy } from '@/types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  return (
    <div className="group relative bg-white dark:bg-[#0D1322] border border-blue-100 dark:border-[#2563EB]/30 hover:border-[#2563EB] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2563EB]/15">
      
      {/* Cover Image & Key Metric Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#111318]">
        <Image
          src={caseStudy.cover_image}
          alt={caseStudy.client_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Subtle image bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Primary Metric Pill */}
        {caseStudy.metrics[0] && (
          <div className="absolute bottom-3 left-3 bg-[#1D4ED8] dark:bg-[#2563EB] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10">
            <TrendingUp className="w-3.5 h-3.5 text-[#06D6A0]" />
            <span>{caseStudy.metrics[0].value} {caseStudy.metrics[0].suffix}</span>
          </div>
        )}
      </div>

      {/* Case Study Details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#0D1322]">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {caseStudy.campaign_type.map((tag, i) => (
              <span key={i} className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-white/10 text-[#1D4ED8] dark:text-[#8A9AAF] font-semibold">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold font-jakarta text-slate-900 dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#06D6A0] transition-colors">
            {caseStudy.client_name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-[#8A9AAF] mt-2 line-clamp-2 leading-relaxed">
            {caseStudy.brief}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono-code text-[#1D4ED8] dark:text-[#06D6A0] font-semibold">Tˣ Campaign Record</span>
          <Link
            href={`/digital/portfolio/${caseStudy.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1D4ED8] dark:text-[#2563EB] group-hover:translate-x-1 transition-transform"
          >
            Read Case Study <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
