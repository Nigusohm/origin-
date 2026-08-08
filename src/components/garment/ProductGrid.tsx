import React, { useState } from 'react';
import { Filter, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView }) => {
  const highestPrice = Math.max(20000, ...products.map(product => product.price_etb || 0));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPriceEtb, setMaxPriceEtb] = useState<number>(highestPrice);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wholesaleOnly, setWholesaleOnly] = useState<boolean>(false);

  const categoryLabels: Record<string, string> = {
    traditional: 'Traditional Habesha', corporate: 'Corporate Blazers & Suites',
    'mini-me': 'Mini-Me Family Sets', custom: 'Custom Uniforms',
  };
  const categories = [
    { id: 'all', label: 'All Collections' },
    ...Array.from(new Set(products.map(product => product.category).filter(Boolean)))
      .sort()
      .map(id => ({ id, label: categoryLabels[id] || id.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()) })),
  ];

  const sizes = ['all', 'S', 'M', 'L', 'XL', '2Y', '4Y', '6Y', '38R', '40R', '42R'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesPrice = p.price_etb <= maxPriceEtb;
    const matchesSize = selectedSize === 'all' || p.sizes.includes(selectedSize);
    const matchesWholesale = !wholesaleOnly || p.is_wholesale;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSize && matchesWholesale && matchesSearch;
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setMaxPriceEtb(highestPrice);
    setSelectedSize('all');
    setSearchQuery('');
    setWholesaleOnly(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sticky Filter Sidebar */}
      <aside className="lg:col-span-1 space-y-6 bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl h-fit sticky top-28 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 font-bold font-jakarta text-sm text-[#F5EEE4]">
            <Filter className="w-4 h-4 text-[#C84B1A]" /> Filter Catalog
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-[#8A9AAF] hover:text-[#C84B1A] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Search Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#D4B896] block mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Habesha, Blazer..."
              className="w-full bg-[#111318] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-[#F5EEE4] placeholder-[#8A9AAF] focus:outline-none focus:border-[#C84B1A]"
            />
            <Search className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#D4B896] block mb-2">Category</label>
          <div className="space-y-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-[#C84B1A] text-white font-bold'
                    : 'text-[#8A9AAF] hover:bg-white/5 hover:text-[#F5EEE4]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#D4B896]">Max Price</label>
            <span className="text-xs font-bold text-[#F5EEE4]">{maxPriceEtb.toLocaleString()} ETB</span>
          </div>
          <input
            type="range"
            min={3000}
            max={highestPrice}
            step={500}
            value={maxPriceEtb}
            onChange={e => setMaxPriceEtb(Number(e.target.value))}
            className="w-full accent-[#C84B1A]"
          />
        </div>

        {/* Size Filter */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#D4B896] block mb-2">Size</label>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  selectedSize === s
                    ? 'bg-[#C84B1A] text-white border-[#C84B1A]'
                    : 'border-white/10 text-[#8A9AAF] hover:bg-white/5'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Wholesale Checkbox */}
        <div className="pt-2 border-t border-white/5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5EEE4]">
            <input
              type="checkbox"
              checked={wholesaleOnly}
              onChange={e => setWholesaleOnly(e.target.checked)}
              className="accent-[#C84B1A] rounded"
            />
            <span>Show Wholesale-Eligible Only</span>
          </label>
        </div>
      </aside>

      {/* Main Catalog Grid */}
      <main className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between bg-[#0A0A0A] border border-white/10 p-4 rounded-2xl text-xs text-[#8A9AAF]">
          <span>Showing <strong className="text-[#F5EEE4]">{filteredProducts.length}</strong> apparel items</span>
          <span className="text-[#D4B896]">Dual Currency: ETB / USD</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center text-[#8A9AAF]">
            <SlidersHorizontal className="w-8 h-8 text-[#C84B1A] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#F5EEE4]">No items match your filter criteria.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-[#C84B1A] text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </main>

    </div>
  );
};
