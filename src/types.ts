export type UserRole = 'customer' | 'division_staff' | 'super_admin' | 'finance_reviewer';

export type DivisionType = 'garment' | 'digital' | 'consulting' | 'branding';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  division?: DivisionType;
  is_verified: boolean;
  avatar?: string;
  created_at: string;
}

export type OrderEnquiryStatus = 
  | 'submitted'
  | 'awaiting_payment'
  | 'payment_submitted'   // set by backend after proof upload
  | 'proof_uploaded'      // alias used in legacy/frontend records
  | 'payment_verified'
  | 'payment_rejected'
  | 'in_progress'
  | 'fulfilled';

export interface PaymentProof {
  file_url: string;
  file_name: string;
  tx_ref?: string;
  uploaded_at: string;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
}

export interface OrderEnquiryRecord {
  id: string;
  type: 'order' | 'enquiry';
  division: DivisionType;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  
  // Item detail
  item_title: string;
  item_slug?: string;
  quantity?: number;
  variant_size?: string;
  variant_color?: string;
  
  // Enquiry specific
  message?: string;
  file_attachment?: string;
  preferred_contact?: 'email' | 'phone' | 'telegram';
  
  // Financial & Quote
  amount_due_etb: number;
  amount_due_usd: number;
  quoted_by_staff?: string;
  quote_notes?: string;
  
  status: OrderEnquiryStatus;
  payment_proof?: PaymentProof;
  
  timeline: {
    status: OrderEnquiryStatus;
    label: string;
    timestamp: string;
    by?: string;
    note?: string;
  }[];
  
  created_at: string;
  updated_at: string;
}

export interface DivisionPaymentAccount {
  division: DivisionType;
  bank_name: string;
  account_name: string;
  account_number: string;
  mobile_money_number: string;
  notes: string;
  updated_at: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division?: DivisionType;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_etb: number;
  price_usd: number;
  // Categories are managed from the admin catalogue, so this must accept
  // categories added after the application was deployed.
  category: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string; stock: number }[];
  is_wholesale?: boolean;
  wholesale_tiers?: { min_qty: number; price_etb: number }[];
  featured?: boolean;
  fabricDetails?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface Order {
  id: string;
  user_id?: string;
  items: CartItem[];
  total_etb: number;
  total_usd: number;
  payment_method: 'chapa' | 'stripe';
  payment_status: 'pending' | 'paid' | 'failed';
  chapa_tx_ref?: string;
  stripe_payment_intent?: string;
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    country: string;
  };
  created_at: string;
}

export interface Review {
  id: string;
  product_id?: string;
  case_study_id?: string;
  user_name: string;
  user_role?: string;
  rating: number;
  comment: string;
  is_verified?: boolean;
  is_verified_buyer?: boolean;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client_name: string;
  is_confidential: boolean;
  category: 'brand-identity' | 'social-media' | 'performance' | 'video' | 'ai-creative';
  campaign_type: string[];
  cover_image: string;
  before_image: string;
  after_image: string;
  brief: string;
  process: { phase: string; title: string; description: string }[];
  metrics: { label: string; value: string; suffix?: string }[];
  collateral: string[];
  testimonial?: { quote: string; name: string; role: string; company: string };
  published_at: string;
}

export interface ConsultingSlot {
  id: string;
  date: string;
  time: string;
  session_type: 'discovery' | 'advisory' | 'workshop';
  duration_min: number;
  is_booked: boolean;
}

export interface Booking {
  id: string;
  slot_id: string;
  client_name: string;
  client_email: string;
  organization?: string;
  role?: string;
  session_type: 'discovery' | 'advisory' | 'workshop';
  description?: string;
  confirmed_at?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  type: 'whitepaper' | 'analysis' | 'brief' | 'case-study' | 'ai-doc';
  industry: string;
  excerpt: string;
  content_mdx: string;
  pdf_url?: string;
  is_gated: boolean;
  published_at: string;
  author: { name: string; role: string; avatar: string };
}

export interface DiscussionComment {
  id: string;
  resource_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  is_verified_pro: boolean;
  created_at: string;
  replies?: DiscussionComment[];
}

export interface MediaItem {
  id: string;
  division: 'bvibe' | 'tx' | 'consulting' | 'branding';
  type: 'Photo' | 'Design' | 'Video' | 'Report';
  title: string;
  url: string;
  thumbnail: string;
  description: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  division: string;
  url: string;
  caption: string;
  tags?: string[];
}
