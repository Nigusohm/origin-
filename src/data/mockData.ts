import { Product, CaseStudy, Resource, ConsultingSlot, MediaItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'sheger-habesha-kemis-modern',
    name: 'Sheger Habesha Modern Linen Dress',
    description: 'Authentic handwoven Ethiopian cotton fabric styled into a contemporary silhouette with metallic gold embroidery around the neckline.',
    price_etb: 8500,
    price_usd: 150,
    category: 'traditional',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF', stock: 15 },
      { name: 'Ember Red', hex: '#C84B1A', stock: 8 },
      { name: 'Sand Gold', hex: '#D4B896', stock: 12 }
    ],
    is_wholesale: true,
    wholesale_tiers: [
      { min_qty: 50, price_etb: 6200 },
      { min_qty: 200, price_etb: 5400 },
      { min_qty: 500, price_etb: 4800 }
    ],
    featured: true,
    fabricDetails: '100% Ethiopian Handspun Cotton with Silk Thread Accent'
  },
  {
    id: 'prod-2',
    slug: 'executive-ethio-blazer',
    name: 'Executive Ethio-Bespoke Blazer',
    description: 'Precision-tailored corporate blazer featuring subtle Tibeb motif detailing on the inner lapel and sleeve lining.',
    price_etb: 11200,
    price_usd: 195,
    category: 'corporate',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: [
      { name: 'Obsidian Black', hex: '#0A0A0A', stock: 20 },
      { name: 'Slate Blue', hex: '#1E3A5F', stock: 14 }
    ],
    is_wholesale: true,
    wholesale_tiers: [
      { min_qty: 50, price_etb: 8500 },
      { min_qty: 200, price_etb: 7600 }
    ],
    featured: true,
    fabricDetails: 'Wool-Linen Blend with Custom Silk Motif Lining'
  },
  {
    id: 'prod-3',
    slug: 'mini-me-habesha-ensemble',
    name: 'Mini-Me Matching Heritage Set',
    description: 'Adorable parent-child matching Ethiopian cultural ensemble designed for family celebrations and holidays.',
    price_etb: 6400,
    price_usd: 110,
    category: 'mini-me',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['2Y', '4Y', '6Y', 'Adult M', 'Adult L'],
    colors: [
      { name: 'Ivory Cream', hex: '#F5EEE4', stock: 25 },
      { name: 'Terracotta', hex: '#C84B1A', stock: 10 }
    ],
    is_wholesale: false,
    featured: true,
    fabricDetails: 'Breathable Organic Cotton with Soft Threading'
  },
  {
    id: 'prod-4',
    slug: 'custom-corporate-uniform-pack',
    name: 'Corporate Hospitality Uniform Suite',
    description: 'Customizable uniform collection for luxury hotel staff, airline personnel, and enterprise front desks.',
    price_etb: 14500,
    price_usd: 250,
    category: 'custom',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['Custom Sizing Available'],
    colors: [
      { name: 'Corporate Gold Navy', hex: '#0C1420', stock: 100 }
    ],
    is_wholesale: true,
    wholesale_tiers: [
      { min_qty: 50, price_etb: 11000 },
      { min_qty: 200, price_etb: 9500 },
      { min_qty: 500, price_etb: 8200 }
    ],
    featured: false,
    fabricDetails: 'Stain-Resistant Heavy-Duty Cotton Twill'
  }
];

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    slug: 'telecom-national-rebrand',
    client_name: 'Ethio-Telecom Retail Network',
    is_confidential: false,
    category: 'brand-identity',
    campaign_type: ['Brand Identity', 'Social Media', '360° Omnichannel'],
    cover_image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=90&w=1600',
    before_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=90&w=1600',
    after_image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=90&w=1600',
    brief: 'A complete modernization of retail touchpoints, digital creative assets, and youth-targeted TikTok/Telegram campaigns across major Ethiopian urban hubs.',
    process: [
      { phase: '01 Strategy', title: 'Youth Market Audit', description: 'Audited digital consumption habits across 25,000 Telegram channel subscribers in Addis Ababa & Hawassa.' },
      { phase: '02 Creative', title: 'Neon Ethio Aesthetic', description: 'Developed Tˣ signature high-contrast typography and motion graphics assets for social ads.' },
      { phase: '03 Execution', title: 'Viral TikTok Challenge', description: 'Launched #ConnectEthio campaign generating over 4.2M organic video views in 14 days.' }
    ],
    metrics: [
      { label: 'Organic Social Reach', value: '4.2M+', suffix: 'views' },
      { label: 'Brand Sentiment Shift', value: '+340%', suffix: 'positive' },
      { label: 'App Installs Generated', value: '185,000', suffix: 'users' }
    ],
    collateral: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=90&w=1200',
      'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=90&w=1200'
    ],
    testimonial: {
      quote: 'Tx Digital transformed our digital presence overnight. Their deep understanding of East African youth culture paired with AI performance tracking gave us unprecedented ROI.',
      name: 'Yonas Tadesse',
      role: 'VP Marketing',
      company: 'Ethio Retail Network'
    },
    published_at: '2026-03-15'
  },
  {
    id: 'cs-2',
    slug: 'banks-ai-campaign',
    client_name: 'Dashen Private Banking',
    is_confidential: false,
    category: 'performance',
    campaign_type: ['Performance Marketing', 'AI Asset Generation', 'Lead Capture'],
    cover_image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=90&w=1600',
    before_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=90&w=1600',
    after_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=90&w=1600',
    brief: 'Optimized high-net-worth investor acquisition using hyper-targeted Facebook and LinkedIn video campaigns localized in Amharic & English.',
    process: [
      { phase: '01 Targeting', title: 'Diaspora Segmentation', description: 'Mapped high-intent Ethiopian diaspora investors in North America and Europe.' },
      { phase: '02 Production', title: 'AI Copy & Imagery', description: 'Generated 120 localized ad variations using Tˣ custom prompt engineering pipelines.' }
    ],
    metrics: [
      { label: 'Cost Per Qualified Lead', value: '-62%', suffix: 'reduction' },
      { label: 'Conversion Rate', value: '8.4%', suffix: 'lead to sign' },
      { label: 'Capital Committed', value: '$12.5M', suffix: 'USD' }
    ],
    collateral: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=90&w=1200'
    ],
    published_at: '2026-05-10'
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    slug: 'ethiopian-ai-operating-model-2026',
    title: 'Framework for AI Integration in East African Enterprises (2026 Report)',
    type: 'whitepaper',
    industry: 'Technology & Governance',
    excerpt: 'An authoritative 45-page executive analysis on deploying LLM agents, localized data security, and automated workflows across Ethiopian private and public sectors.',
    content_mdx: `
# Executive Overview
As East Africa accelerates digital transformations, enterprise leaders face the dual challenge of legacy system migration and rapid AI adoption. This whitepaper provides a battle-tested roadmap for Ethiopian corporations.

## Key Recommendations:
1. **Hybrid On-Prem / Cloud Pipelines:** Ensure local data sovereignty compliance while leveraging high-speed cloud AI models.
2. **Amharic & Oromiffa NLP Fine-Tuning:** Custom models for automated customer onboarding and dispute handling.
3. **Agile Governance Board:** Establishing ethical guidelines and automated human-in-the-loop review steps.
`,
    pdf_url: 'https://originandeverlasting.com/docs/ai-framework-2026.pdf',
    is_gated: false,
    published_at: '2026-06-01',
    author: {
      name: 'Dr. Berhanu Hailu',
      role: 'Senior Managing Director, Strategic Consulting Hub',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'res-2',
    slug: 'manufacturing-export-readiness-ethiopia',
    title: 'Textile & Garment Export Readiness Benchmark: AGOA & EU Standards',
    type: 'analysis',
    industry: 'Garment & Industrial Manufacturing',
    excerpt: 'A strategic assessment of quality compliance, sustainable supply chains, and labor certification required for Ethiopian textile exporters.',
    content_mdx: `
# Global Garment Standard Guidelines
Exporting high-value apparel from Ethiopian industrial parks requires strict adherence to international environmental and safety protocols.

## Pillars of Garment Quality Control:
- **Traceability:** From local cotton farm harvesting in Tigray & SNNPR to finishing line.
- **Waste Reduction:** Zero-liquid discharge dye facilities.
`,
    pdf_url: 'https://originandeverlasting.com/docs/export-benchmark.pdf',
    is_gated: true,
    published_at: '2026-04-18',
    author: {
      name: 'Frehiwot Assefa, MBA',
      role: 'Head of Industrial Supply Chain Practice',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    }
  }
];

export const INITIAL_SLOTS: ConsultingSlot[] = [
  { id: 'slot-1', date: '2026-08-01', time: '10:00:00', session_type: 'discovery', duration_min: 30, is_booked: false },
  { id: 'slot-2', date: '2026-08-01', time: '14:00:00', session_type: 'advisory', duration_min: 60, is_booked: false },
  { id: 'slot-3', date: '2026-08-02', time: '11:00:00', session_type: 'workshop', duration_min: 90, is_booked: false },
  { id: 'slot-4', date: '2026-08-03', time: '09:30:00', session_type: 'discovery', duration_min: 30, is_booked: false },
  { id: 'slot-5', date: '2026-08-04', time: '15:00:00', session_type: 'advisory', duration_min: 60, is_booked: false },
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-1',
    division: 'bvibe',
    type: 'Photo',
    title: 'Traditional Habesha Weaving Craftsmanship',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400',
    description: 'Master artisan weaving custom silk tibeb threads in B-VIBE Addis Ababa garment facility.'
  },
  {
    id: 'media-2',
    division: 'tx',
    type: 'Design',
    title: 'Neon Ethio Brand Identity Keyframe',
    url: 'https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=400',
    description: 'Tˣ Creative Agency brand keyframe for national telecom campaign.'
  },
  {
    id: 'media-3',
    division: 'consulting',
    type: 'Report',
    title: 'Enterprise AI Governance Whitepaper Cover',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    description: 'Executive briefing cover for Strategic Consulting Hub report.'
  },
  {
    id: 'media-4',
    division: 'bvibe',
    type: 'Photo',
    title: 'B-VIBE Garment Industrial Sewing Floor',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400',
    description: 'High-speed automated stitching machines for wholesale corporate uniform production.'
  },
  {
    id: 'media-5',
    division: 'tx',
    type: 'Video',
    title: 'Short-Form TikTok Creative Reel 2026',
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400',
    description: 'High-engagement video reel production by Tˣ Agency.'
  }
];

export const initialProducts = INITIAL_PRODUCTS;
export const initialCaseStudies = INITIAL_CASE_STUDIES;
export const initialResources = INITIAL_RESOURCES;
export const initialConsultingSlots = INITIAL_SLOTS;

export const initialMediaAssets = INITIAL_MEDIA_ITEMS.map(m => ({
  id: m.id,
  title: m.title,
  division: m.division,
  url: m.url,
  caption: m.description,
  tags: [m.type]
}));
