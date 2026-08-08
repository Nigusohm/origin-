'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  OrderEnquiryRecord,
  DivisionPaymentAccount,
  StaffAccount,
  DivisionType,
} from '@/types';
import { getStoredToken } from '@/context/AuthContext';

interface OrderEnquiryContextType {
  records: OrderEnquiryRecord[];
  divisionAccounts: DivisionPaymentAccount[];
  staffAccounts: StaffAccount[];

  // Refresh from server
  refreshRecords: () => Promise<void>;
  
  // Customer Actions
  createOrder: (data: Omit<OrderEnquiryRecord, 'id' | 'status' | 'created_at' | 'updated_at' | 'timeline'>) => Promise<OrderEnquiryRecord>;
  createEnquiry: (data: Omit<OrderEnquiryRecord, 'id' | 'status' | 'created_at' | 'updated_at' | 'timeline'>) => Promise<OrderEnquiryRecord>;
  
  // Admin Actions
  verifyPayment: (recordId: string, staffName: string) => void;
  rejectPayment: (recordId: string, staffName: string, reason: string) => void;
  sendQuote: (recordId: string, staffName: string, amountETB: number, amountUSD: number, notes: string) => void;
  updateStatus: (recordId: string, staffName: string, status: OrderEnquiryRecord['status'], note?: string) => void;
  
  // Super Admin Management
  updateDivisionAccount: (division: DivisionType, account: Omit<DivisionPaymentAccount, 'division' | 'updated_at'>) => void;
  createStaffAccount: (staff: Omit<StaffAccount, 'id' | 'created_at'>) => void;
  toggleStaffStatus: (staffId: string) => void;
}

const INITIAL_DIVISION_ACCOUNTS: DivisionPaymentAccount[] = [
  {
    division: 'garment',
    bank_name: 'Commercial Bank of Ethiopia (CBE)',
    account_name: 'Origin & Everlasting PLC - B-VIBE Garment Div',
    account_number: '1000348291048',
    mobile_money_number: 'Telebirr: 0911223344 (B-VIBE Merchant)',
    notes: 'Please include your Order/Enquiry Reference # in the transfer memo. Wholesale export orders accept USD L/C wire transfers.',
    updated_at: '2026-07-01T00:00:00Z',
  },
  {
    division: 'digital',
    bank_name: 'Awash Bank',
    account_name: 'Origin & Everlasting PLC - Tˣ Digital Agency',
    account_number: '01320492810400',
    mobile_money_number: 'Telebirr: 0922334455 (Tˣ Creative)',
    notes: '50% upfront retainer required to start performance creative sprints and Telegram growth campaigns.',
    updated_at: '2026-07-01T00:00:00Z',
  },
  {
    division: 'consulting',
    bank_name: 'Dashen Bank',
    account_name: 'Origin & Everlasting PLC - Advisory Division',
    account_number: '5281048291011',
    mobile_money_number: 'Telebirr: 0911001122 (OE Strategic)',
    notes: 'Executive retainer invoices are payable within 7 business days upon quote issuance.',
    updated_at: '2026-07-01T00:00:00Z',
  },
  {
    division: 'branding',
    bank_name: 'Cooperative Bank of Oromia',
    account_name: 'Origin & Everlasting PLC - Branding Division',
    account_number: '1000789123456',
    mobile_money_number: 'Telebirr: 0911334455 (OE Branding)',
    notes: 'Please include your Branding Enquiry or Order Reference # in the transfer memo.',
    updated_at: '2026-07-01T00:00:00Z',
  },
];

const INITIAL_RECORDS: OrderEnquiryRecord[] = [
  {
    id: 'OE-GAR-9021',
    type: 'order',
    division: 'garment',
    customer_id: 'usr_customer_01',
    customer_name: 'Bethlehem Tadesse',
    customer_email: 'client@origineverlasting.com',
    customer_phone: '+251911223344',
    item_title: 'Imperial Habesha Silk Dress',
    item_slug: 'imperial-habesha-silk-dress',
    quantity: 2,
    variant_size: 'M',
    variant_color: 'Ivory White',
    amount_due_etb: 29000,
    amount_due_usd: 240,
    status: 'proof_uploaded',
    payment_proof: {
      file_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      file_name: 'cbe_transfer_receipt_9021.pdf',
      tx_ref: 'CBE-TX-984210492',
      uploaded_at: '2026-07-22T14:30:00Z',
    },
    timeline: [
      { status: 'submitted', label: 'Order Placed by Customer', timestamp: '2026-07-22T14:00:00Z' },
      { status: 'awaiting_payment', label: 'Payment Instructions Issued', timestamp: '2026-07-22T14:00:00Z' },
      { status: 'proof_uploaded', label: 'Payment Proof Receipt Uploaded', timestamp: '2026-07-22T14:30:00Z' },
    ],
    created_at: '2026-07-22T14:00:00Z',
    updated_at: '2026-07-22T14:30:00Z',
  },
  {
    id: 'OE-TX-4402',
    type: 'enquiry',
    division: 'digital',
    customer_id: 'usr_customer_01',
    customer_name: 'Bethlehem Tadesse',
    customer_email: 'client@origineverlasting.com',
    customer_phone: '+251911223344',
    item_title: 'TikTok Omnichannel Growth Package',
    message: 'We are seeking a 3-month TikTok and Telegram influencer media push for our new coffee retail chain launch in Addis Ababa.',
    preferred_contact: 'telegram',
    amount_due_etb: 0,
    amount_due_usd: 0,
    status: 'submitted',
    timeline: [
      { status: 'submitted', label: 'Enquiry Received', timestamp: '2026-07-23T09:15:00Z' },
    ],
    created_at: '2026-07-23T09:15:00Z',
    updated_at: '2026-07-23T09:15:00Z',
  },
];

const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'stf_01',
    name: 'Abebe Bikila',
    email: 'garment.staff@origineverlasting.com',
    role: 'division_staff',
    division: 'garment',
    is_active: true,
    created_at: '2026-06-15T08:30:00Z',
  },
  {
    id: 'stf_02',
    name: 'Helina Solomon',
    email: 'tx.staff@origineverlasting.com',
    role: 'division_staff',
    division: 'digital',
    is_active: true,
    created_at: '2026-06-15T08:30:00Z',
  },
  {
    id: 'stf_03',
    name: 'Dawit Yohannes',
    email: 'consulting.staff@origineverlasting.com',
    role: 'division_staff',
    division: 'consulting',
    is_active: true,
    created_at: '2026-06-15T08:30:00Z',
  },
  {
    id: 'stf_04',
    name: 'Super Admin HQ',
    email: 'superadmin@origineverlasting.com',
    role: 'super_admin',
    is_active: true,
    created_at: '2026-05-01T08:00:00Z',
  },
];

const OrderEnquiryContext = createContext<OrderEnquiryContextType | undefined>(undefined);

export const OrderEnquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<OrderEnquiryRecord[]>([]);
  const [divisionAccounts, setDivisionAccounts] = useState<DivisionPaymentAccount[]>(INITIAL_DIVISION_ACCOUNTS);
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(INITIAL_STAFF_ACCOUNTS);

  // Fetch real records from the backend on mount
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRecords() {
    const token = getStoredToken();
    if (!token) {
      // Not authenticated — fall back to localStorage / seed data
      const savedRecs = localStorage.getItem('oe_records');
      if (savedRecs) {
        try { setRecords(JSON.parse(savedRecs)); } catch { setRecords(INITIAL_RECORDS); }
      } else {
        setRecords(INITIAL_RECORDS);
      }
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ordersRes, enquiriesRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/enquiries', { headers }),
      ]);

      // Backend returns { records: [...], count, ... } — extract the array
      const extractRecords = async (res: Response): Promise<OrderEnquiryRecord[]> => {
        if (!res.ok) return [];
        const body = await res.json();
        if (Array.isArray(body)) return body;
        if (Array.isArray(body.records)) return body.records;
        return [];
      };

      const [ordersData, enquiriesData] = await Promise.all([
        extractRecords(ordersRes),
        extractRecords(enquiriesRes),
      ]);

      const combined: OrderEnquiryRecord[] = [...ordersData, ...enquiriesData];

      if (combined.length > 0) {
        setRecords(combined);
        // Don't persist to localStorage — always re-fetch from server
      } else {
        // Authenticated but no records yet — show empty list (not seed data)
        setRecords([]);
      }
    } catch {
      // Network error fallback
      const savedRecs = localStorage.getItem('oe_records');
      if (savedRecs) {
        try { setRecords(JSON.parse(savedRecs)); } catch { setRecords([]); }
      }
    }

    const savedAccounts = localStorage.getItem('oe_div_accounts');
    if (savedAccounts) {
      try { setDivisionAccounts(JSON.parse(savedAccounts)); } catch {}
    }

    const savedStaff = localStorage.getItem('oe_staff');
    if (savedStaff) {
      try { setStaffAccounts(JSON.parse(savedStaff)); } catch {}
    }
  }



  const saveRecords = (newRecords: OrderEnquiryRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('oe_records', JSON.stringify(newRecords));
  };

  const DIVISION_TO_BACKEND: Record<string, string> = { garment: 'bvibe', digital: 'tx', consulting: 'consulting', branding: 'branding' };

  const createOrder = async (data: Omit<OrderEnquiryRecord, 'id' | 'status' | 'created_at' | 'updated_at' | 'timeline'>): Promise<OrderEnquiryRecord> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        division: DIVISION_TO_BACKEND[data.division] ?? data.division,
        shippingName:  data.customer_name,
        shippingEmail: data.customer_email,
        shippingPhone: data.customer_phone ?? undefined,
        shippingAddress: {
          line1:   '',
          city:    '',
          region:  '',
          country: 'Ethiopia',
        },
        items: [{
          product_id: data.item_slug || 'direct-item',
          name:       data.item_title || 'Custom Order',
          qty:        data.quantity || 1,
          size:       data.variant_size,
          color:      data.variant_color,
          price_etb:  data.amount_due_etb / (data.quantity || 1),
        }],
        paymentMethod: 'bank_transfer',
        notes: data.message ?? undefined,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Order creation failed (HTTP ${res.status})`);
    }

    const body = await res.json();
    // Backend returns { success, order: { id, division, amount, status, createdAt } }
    const serverOrder = body.order ?? body;
    const now = new Date().toISOString();
    const newRecord: OrderEnquiryRecord = {
      ...data,
      id: serverOrder.id,
      status: serverOrder.status ?? 'awaiting_payment',
      created_at: serverOrder.createdAt ?? now,
      updated_at: serverOrder.createdAt ?? now,
      timeline: [
        { status: 'submitted',        label: 'Order Created',              timestamp: now },
        { status: 'awaiting_payment', label: 'Payment Instructions Issued', timestamp: now },
      ],
    };
    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const createEnquiry = async (data: Omit<OrderEnquiryRecord, 'id' | 'status' | 'created_at' | 'updated_at' | 'timeline'>): Promise<OrderEnquiryRecord> => {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        division: DIVISION_TO_BACKEND[data.division] ?? data.division,
        customerName:  data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone ?? undefined,
        message: data.message || data.item_title || 'Service enquiry',
        subject: data.item_title ?? undefined,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Enquiry submission failed (HTTP ${res.status})`);
    }

    const body = await res.json();
    // Backend returns { success, enquiry: { id, division, status, createdAt } }
    const serverEnquiry = body.enquiry ?? body;
    const now = new Date().toISOString();
    const newRecord: OrderEnquiryRecord = {
      ...data,
      id: serverEnquiry.id,
      status: serverEnquiry.status ?? 'submitted',
      created_at: serverEnquiry.createdAt ?? now,
      updated_at: serverEnquiry.createdAt ?? now,
      timeline: [
        { status: 'submitted', label: 'Enquiry Request Submitted', timestamp: now },
      ],
    };
    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };



  const verifyPayment = (recordId: string, staffName: string) => {
    const now = new Date().toISOString();
    const updated = records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'payment_verified' as const,
          payment_proof: r.payment_proof ? { ...r.payment_proof, verified_by: staffName, verified_at: now } : undefined,
          updated_at: now,
          timeline: [
            ...r.timeline,
            { status: 'payment_verified' as const, label: `Payment Verified by ${staffName}`, timestamp: now, by: staffName },
            { status: 'in_progress' as const, label: 'Order Processing & Fulfillment Started', timestamp: now },
          ],
        };
      }
      return r;
    });
    saveRecords(updated);
  };

  const rejectPayment = (recordId: string, staffName: string, reason: string) => {
    const now = new Date().toISOString();
    const updated = records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'payment_rejected' as const,
          payment_proof: r.payment_proof ? { ...r.payment_proof, rejection_reason: reason } : undefined,
          updated_at: now,
          timeline: [
            ...r.timeline,
            { status: 'payment_rejected' as const, label: `Payment Receipt Rejected: ${reason}`, timestamp: now, by: staffName, note: reason },
          ],
        };
      }
      return r;
    });
    saveRecords(updated);
  };

  const sendQuote = (recordId: string, staffName: string, amountETB: number, amountUSD: number, notes: string) => {
    const now = new Date().toISOString();
    const updated = records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          amount_due_etb: amountETB,
          amount_due_usd: amountUSD,
          quoted_by_staff: staffName,
          quote_notes: notes,
          status: 'awaiting_payment' as const,
          updated_at: now,
          timeline: [
            ...r.timeline,
            { status: 'awaiting_payment' as const, label: `Official Proposal Issued (${amountETB.toLocaleString()} ETB / $${amountUSD}) by ${staffName}`, timestamp: now, by: staffName, note: notes },
          ],
        };
      }
      return r;
    });
    saveRecords(updated);
  };

  const updateStatus = (recordId: string, staffName: string, status: OrderEnquiryRecord['status'], note?: string) => {
    const now = new Date().toISOString();
    const updated = records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status,
          updated_at: now,
          timeline: [
            ...r.timeline,
            { status, label: `Status updated to ${status}`, timestamp: now, by: staffName, note },
          ],
        };
      }
      return r;
    });
    saveRecords(updated);
  };

  const updateDivisionAccount = (division: DivisionType, account: Omit<DivisionPaymentAccount, 'division' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const updated = divisionAccounts.map(a => (a.division === division ? { ...account, division, updated_at: now } : a));
    setDivisionAccounts(updated);
    localStorage.setItem('oe_div_accounts', JSON.stringify(updated));
  };

  const createStaffAccount = (staff: Omit<StaffAccount, 'id' | 'created_at'>) => {
    const newStaff: StaffAccount = {
      ...staff,
      id: `stf_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [...staffAccounts, newStaff];
    setStaffAccounts(updated);
    localStorage.setItem('oe_staff', JSON.stringify(updated));
  };

  const toggleStaffStatus = (staffId: string) => {
    const updated = staffAccounts.map(s => (s.id === staffId ? { ...s, is_active: !s.is_active } : s));
    setStaffAccounts(updated);
    localStorage.setItem('oe_staff', JSON.stringify(updated));
  };

  return (
    <OrderEnquiryContext.Provider
      value={{
        records,
        divisionAccounts,
        staffAccounts,
        refreshRecords: fetchRecords,
        createOrder,
        createEnquiry,
        verifyPayment,
        rejectPayment,
        sendQuote,
        updateStatus,
        updateDivisionAccount,
        createStaffAccount,
        toggleStaffStatus,
      }}
    >
      {children}
    </OrderEnquiryContext.Provider>
  );
};

export const useOrderEnquiry = () => {
  const context = useContext(OrderEnquiryContext);
  if (!context) {
    throw new Error('useOrderEnquiry must be used within an OrderEnquiryProvider');
  }
  return context;
};
