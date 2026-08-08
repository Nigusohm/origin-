'use client';

import React from 'react';
import { CaseStudyCard } from '@/components/digital/CaseStudyCard';
import { initialCaseStudies } from '@/data/mockData';
import { CaseStudy } from '@/types';

interface DigitalPortfolioProps {
  caseStudies?: CaseStudy[];
}

export const DigitalPortfolio: React.FC<DigitalPortfolioProps> = ({ caseStudies = initialCaseStudies }) => {
  return (
    <main data-division="tx" className="bg-[#060810] text-[#F8FAFC] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <span className="text-xs uppercase font-mono-code text-[#06D6A0]">Tˣ Campaign Record</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F8FAFC] mt-1">Client Case Studies</h1>
          <p className="text-xs text-[#8A9AAF] mt-2">Data-backed creative performance and audience conversion across East Africa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map(cs => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))}
        </div>
      </div>
    </main>
  );
};
