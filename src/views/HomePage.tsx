import React from 'react';
import { CorporateHero } from '../components/corporate/CorporateHero';
import { DivisionsGrid } from '../components/corporate/DivisionsGrid';

export const HomePage: React.FC = () => {
  return (
    <main data-division="corporate" className="bg-[#080A0F]">
      <CorporateHero />
      <DivisionsGrid />
    </main>
  );
};
