'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Sliders } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Legacy Brand',
  afterLabel = 'Tˣ Rebrand',
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[350px] sm:h-[450px] rounded-3xl overflow-hidden border border-white/10 select-none cursor-ew-resize shadow-2xl"
    >
      {/* Before Image (Underneath) */}
      <Image
        src={beforeImage}
        alt="Before transformation"
        fill
        sizes="(max-width: 1200px) 100vw, 80vw"
        className="object-cover"
      />
      <span className="absolute top-4 left-4 bg-black/70 text-white font-mono-code text-xs px-3 py-1 rounded-full border border-white/10 z-10">
        {beforeLabel}
      </span>

      {/* After Image (Clipped Top Layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <Image
          src={afterImage}
          alt="After transformation"
          fill
          sizes="(max-width: 1200px) 100vw, 80vw"
          className="object-cover"
        />
        <span className="absolute top-4 right-4 bg-[#2563EB] text-white font-mono-code text-xs px-3 py-1 rounded-full shadow-lg z-10">
          {afterLabel}
        </span>
      </div>

      {/* Draggable Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-[#06D6A0] shadow-2xl z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#06D6A0] text-[#060810] flex items-center justify-center shadow-xl font-bold">
          <Sliders className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
