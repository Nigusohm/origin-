import React from 'react';
import { MediaLibraryPage } from '@/views/MediaLibraryPage';
import { MediaAsset } from '@/types';

async function fetchMediaAssets(): Promise<MediaAsset[]> {
  try {
    const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/media-assets`, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const assets = await fetchMediaAssets();
  return <MediaLibraryPage assets={assets} />;
}
