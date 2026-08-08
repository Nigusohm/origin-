'use client';

import React from 'react';
import { WholesaleForm } from '@/components/garment/WholesaleForm';

export const GarmentWholesale: React.FC = () => {
  return (
    <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C84B1A]">B2B & Export Portal</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F5EEE4] mt-2">
            Garment Volume Wholesale RFQ
          </h1>
          <p className="text-xs text-[#8A9AAF] max-w-xl mx-auto mt-2">
            Supply your hotel staff, airline crew, corporate officers, or retail distribution network directly from our Addis Ababa manufacturing plant.
          </p>
        </div>

        <WholesaleForm />
      </div>
    </main>
  );
};
