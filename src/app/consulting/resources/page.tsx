import React from 'react';
import { ConsultingResources } from '@/views/consulting/ConsultingResources';
import { Resource } from '@/types';
import { initialResources } from '@/data/mockData';

async function fetchResources(): Promise<Resource[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/resources`, { cache: 'no-store' });
    if (!res.ok) return initialResources;
    const data = await res.json();
    return Array.isArray(data) ? data : initialResources;
  } catch {
    return initialResources;
  }
}

export default async function Page() {
  const resources = await fetchResources();
  return <ConsultingResources resources={resources} />;
}
