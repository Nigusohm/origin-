'use client';

import React from 'react';
import { ServiceConfigurator } from '@/components/digital/ServiceConfigurator';

export const DigitalPackages: React.FC = () => {
  return (
    <main data-division="tx" className="bg-[#060810] text-[#F8FAFC] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center">
          <span className="text-xs font-mono-code uppercase text-[#06D6A0]">Tˣ Scope Engine</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F8FAFC] mt-2">Interactive Package Builder</h1>
          <p className="text-xs text-[#8A9AAF] max-w-xl mx-auto mt-2">Customize your agency package base, toggle modular capabilities, and generate real-time proposal estimates.</p>
        </div>

        <ServiceConfigurator />
      </div>
    </main>
  );
};
