'use client';

import React from 'react';
import { LookbookSlider } from '@/components/garment/LookbookSlider';


export const GarmentLookbook: React.FC = () => {
  return (
    <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-16">
      <LookbookSlider />
    </main>
  );
};
