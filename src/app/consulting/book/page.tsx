import React from 'react';
import { ConsultingBook } from '@/views/consulting/ConsultingBook';
import { ConsultingSlot } from '@/types';
import { initialConsultingSlots } from '@/data/mockData';

async function fetchSlots(): Promise<ConsultingSlot[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const res = await fetch(`${baseUrl}/api/book?month=${month}&year=${year}`, { cache: 'no-store' });
    if (!res.ok) return initialConsultingSlots;
    const data = await res.json();
    const slots: ConsultingSlot[] = (data.slots ?? []).map((s: any) => ({
      id: s.id,
      date: s.slot_date,
      time: s.slot_time,
      session_type: s.session_type,
      duration_min: s.duration_minutes,
      is_booked: s.is_booked,
    }));
    return slots.length > 0 ? slots : initialConsultingSlots;
  } catch {
    return initialConsultingSlots;
  }
}

export default async function Page() {
  const slots = await fetchSlots();
  return <ConsultingBook slots={slots} />;
}
