import React from 'react';

interface DivisionBadgeProps {
  division: 'bvibe' | 'tx' | 'consulting' | 'branding' | 'corporate';
  className?: string;
}

export const DivisionBadge: React.FC<DivisionBadgeProps> = ({ division, className = '' }) => {
  const badgeStyles = {
    bvibe: 'bg-[#C84B1A]/15 text-[#C84B1A] border-[#C84B1A]/30',
    tx: 'bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/30',
    consulting: 'bg-[#C8961E]/15 text-[#C8961E] border-[#C8961E]/30',
    branding: 'bg-[#06D6A0]/15 text-[#06D6A0] border-[#06D6A0]/30',
    corporate: 'bg-[#8A9AAF]/15 text-[#F4F1EC] border-[#8A9AAF]/30'
  };

  const labels = {
    bvibe: 'B-VIBE Garment',
    tx: 'Tˣ Digital Agency',
    consulting: 'Consulting & Training',
    branding: 'Branding & Promotion',
    corporate: 'Origin & Everlasting'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase border rounded-full ${badgeStyles[division]} ${className}`}
    >
      {labels[division]}
    </span>
  );
};
