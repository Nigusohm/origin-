'use client';

import React from 'react';
import { BookingCalendar } from '@/components/consulting/BookingCalendar';
import { initialConsultingSlots } from '@/data/mockData';
import { ConsultingSlot } from '@/types';

interface ConsultingBookProps {
  slots?: ConsultingSlot[];
}

export const ConsultingBook: React.FC<ConsultingBookProps> = ({ slots = initialConsultingSlots }) => {
  return (
    <main data-division="consulting" className="bg-[#080A0F] text-[#F0EDE8] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Direct Partner Access</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F0EDE8] mt-2">Book Executive Session</h1>
          <p className="text-xs text-[#8A9AAF] max-w-xl mx-auto mt-2">Lock in atomic 30-minute discovery, 60-minute advisory, or 90-minute workshop planning slots.</p>
        </div>

        <BookingCalendar slots={slots} />
      </div>
    </main>
  );
};
