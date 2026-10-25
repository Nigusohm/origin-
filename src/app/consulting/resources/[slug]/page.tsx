import React from 'react';
import { ConsultingResourceDetail } from '@/views/consulting/ConsultingResourceDetail';
import { Resource } from '@/types';
import { initialResources } from '@/data/mockData';

async function fetchResources(): Promise<Resource[]> {
  try {
    const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/resources`, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return initialResources;
    const data = await res.json();
    return Array.isArray(data) ? data : initialResources;
  } catch {
    return initialResources;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resources = await fetchResources();
  return <ConsultingResourceDetail slug={slug} resources={resources} />;
}
