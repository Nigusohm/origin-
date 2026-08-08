import React from 'react';
import { GarmentProductDetail } from '@/views/garment/GarmentProductDetail';
import { Product } from '@/types';
import { initialProducts } from '@/data/mockData';

async function fetchProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    if (!res.ok) return initialProducts;
    const data = await res.json();
    return Array.isArray(data) ? data : initialProducts;
  } catch {
    return initialProducts;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await fetchProducts();
  return <GarmentProductDetail slug={slug} products={products} />;
}
