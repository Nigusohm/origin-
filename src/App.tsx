import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import { CorporateNav } from './components/corporate/CorporateNav';
import { CorporateFooter } from './components/corporate/CorporateFooter';
import { AIChat } from './components/shared/AIChat';

// Initial Data
import { initialProducts, initialCaseStudies, initialConsultingSlots, initialResources } from './data/mockData';
import { Product, CartItem, CaseStudy, ConsultingSlot, Resource } from './types';

// Pages
import { HomePage } from './views/HomePage';
import { AboutPage } from './views/AboutPage';
import { DivisionsPage } from './views/DivisionsPage';
import { MediaLibraryPage } from './views/MediaLibraryPage';
import { ContactPage } from './views/ContactPage';

// Garment Pages
import { GarmentHome } from './views/garment/GarmentHome';
import { GarmentShop } from './views/garment/GarmentShop';
import { GarmentProductDetail } from './views/garment/GarmentProductDetail';
import { GarmentWholesale } from './views/garment/GarmentWholesale';
import { GarmentLookbook } from './views/garment/GarmentLookbook';
import { GarmentCart } from './views/garment/GarmentCart';

// Digital Pages
import { DigitalHome } from './views/digital/DigitalHome';
import { DigitalPortfolio } from './views/digital/DigitalPortfolio';
import { DigitalCaseStudyDetail } from './views/digital/DigitalCaseStudyDetail';
import { DigitalPackages } from './views/digital/DigitalPackages';
import { DigitalServices } from './views/digital/DigitalServices';

// Consulting Pages
import { ConsultingHome } from './views/consulting/ConsultingHome';
import { ConsultingBook } from './views/consulting/ConsultingBook';
import { ConsultingResources } from './views/consulting/ConsultingResources';
import { ConsultingResourceDetail } from './views/consulting/ConsultingResourceDetail';
import { ConsultingInsights } from './views/consulting/ConsultingInsights';

// Quick View Modal Component
import { X, ShoppingBag } from 'lucide-react';

const QuickViewModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', hex: '#FFFFFF' });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#0A0A0A] border border-white/20 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#8A9AAF] hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover rounded-2xl" />
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#C84B1A]">{product.category}</span>
            <h3 className="text-xl font-bold font-cormorant text-[#F5EEE4]">{product.name}</h3>
            <div className="text-base font-bold text-[#C84B1A]">{product.price_etb.toLocaleString()} ETB (~${product.price_usd} USD)</div>
            <p className="text-xs text-[#8A9AAF] line-clamp-3">{product.description}</p>
            <button
              onClick={() => {
                onAddToCart(product, selectedSize, selectedColor);
                onClose();
              }}
              className="w-full py-3 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [consultingSlots, setConsultingSlots] = useState<ConsultingSlot[]>(initialConsultingSlots);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleAddToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.selectedSize === size && i.selectedColor.name === color.name
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const handleUpdateQuantity = (index: number, qty: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = qty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleSlotBooked = () => {
    // Refresh slots if needed
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-[#F4F1EC] font-jakarta flex flex-col justify-between">
      
      {/* Navigation Bar */}
      <CorporateNav cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      {/* Main App Routes with Fade-in Page Transition */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Routes location={location}>
              {/* Corporate Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/divisions" element={<DivisionsPage />} />
              <Route path="/media" element={<MediaLibraryPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Garment Division Routes */}
              <Route
                path="/garment"
                element={
                  <GarmentHome
                    products={initialProducts}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                }
              />
              <Route
                path="/garment/shop"
                element={
                  <GarmentShop
                    products={initialProducts}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                }
              />
              <Route
                path="/garment/shop/:slug"
                element={
                  <GarmentProductDetail
                    products={initialProducts}
                    onAddToCart={handleAddToCart}
                  />
                }
              />
              <Route path="/garment/wholesale" element={<GarmentWholesale />} />
              <Route path="/garment/lookbook" element={<GarmentLookbook />} />
              <Route
                path="/garment/cart"
                element={<GarmentCart items={cart} onClearCart={() => setCart([])} />}
              />

              {/* Digital Agency Routes */}
              <Route path="/digital" element={<DigitalHome caseStudies={initialCaseStudies} />} />
              <Route path="/digital/portfolio" element={<DigitalPortfolio caseStudies={initialCaseStudies} />} />
              <Route path="/digital/portfolio/:slug" element={<DigitalCaseStudyDetail caseStudies={initialCaseStudies} />} />
              <Route path="/digital/packages" element={<DigitalPackages />} />
              <Route path="/digital/services" element={<DigitalServices />} />

              {/* Strategic Consulting Routes */}
              <Route
                path="/consulting"
                element={
                  <ConsultingHome
                    slots={consultingSlots}
                    resources={initialResources}
                    onSlotBooked={handleSlotBooked}
                  />
                }
              />
              <Route
                path="/consulting/book"
                element={
                  <ConsultingBook
                    slots={consultingSlots}
                    onSlotBooked={handleSlotBooked}
                  />
                }
              />
              <Route path="/consulting/resources" element={<ConsultingResources resources={initialResources} />} />
              <Route
                path="/consulting/resources/:slug"
                element={<ConsultingResourceDetail resources={initialResources} />}
              />
              <Route path="/consulting/insights" element={<ConsultingInsights />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Corporate Footer */}
      <CorporateFooter />

      {/* Floating AI Chat Assistant */}
      <AIChat />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
