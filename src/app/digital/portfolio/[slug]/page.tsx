import React from 'react';
import { DigitalCaseStudyDetail } from '@/views/digital/DigitalCaseStudyDetail';
import { CaseStudy } from '@/types';
import { initialCaseStudies } from '@/data/mockData';

async function fetchCaseStudies(): Promise<CaseStudy[]> {
  try {
    const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/case-studies`, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return initialCaseStudies;
    const data = await res.json();
    return Array.isArray(data) ? data : initialCaseStudies;
  } catch {
    return initialCaseStudies;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudies = await fetchCaseStudies();
  return <DigitalCaseStudyDetail slug={slug} caseStudies={caseStudies} />;
}
