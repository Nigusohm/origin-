import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { OrderEnquiryProvider } from '@/context/OrderEnquiryContext';
import { CorporateNav } from '@/components/corporate/CorporateNav';
import { CorporateFooter } from '@/components/corporate/CorporateFooter';
import { AIChat } from '@/components/shared/AIChat';

export const metadata: Metadata = {
  title: 'Origin & Everlasting Trading PLC | Multidisciplinary Ethiopian Enterprise',
  description: 'Premier Ethiopian conglomerate advancing cultural textile craftsmanship (B-VIBE Garment), digital brand transformation (Tˣ Agency), and strategic business advisory.',
  keywords: ['Ethiopia', 'Addis Ababa', 'Garment Manufacturing', 'Traditional Habesha', 'Digital Marketing Agency', 'Management Consulting', 'B2B Wholesale'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#080A0F] text-[#F4F1EC] min-h-screen flex flex-col font-jakarta antialiased selection:bg-[#C8961E] selection:text-black">
        <AuthProvider>
          <OrderEnquiryProvider>
            <ThemeProvider>
              <CartProvider>
                <CorporateNav />
                <div className="flex-1">{children}</div>
                <CorporateFooter />
                <AIChat />
              </CartProvider>
            </ThemeProvider>
          </OrderEnquiryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
