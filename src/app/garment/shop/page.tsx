import React from 'react';
import { GarmentShop } from '@/views/garment/GarmentShop';
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

export default async function Page() {
  const products = await fetchProducts();
  return <GarmentShop products={products} />;
}
