'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';
import { DivisionType } from '@/types';

export default function AdminAccountsPage() {
  const { user } = useAuth();
  const { divisionAccounts, updateDivisionAccount } = useOrderEnquiry();

  const [selectedDiv, setSelectedDiv] = useState<DivisionType>('garment');
  const activeAccount = divisionAccounts.find(a => a.division === selectedDiv) || divisionAccounts[0];

  const [bankName, setBankName] = useState(activeAccount.bank_name);
  const [accountName, setAccountName] = useState(activeAccount.account_name);
  const [accountNumber, setAccountNumber] = useState(activeAccount.account_number);
  const [mobileMoney, setMobileMoney] = useState(activeAccount.mobile_money_number);
  const [notes, setNotes] = useState(activeAccount.notes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectDiv = (div: DivisionType) => {
    setSelectedDiv(div);
    const acc = divisionAccounts.find(a => a.division === div);
    if (acc) {
      setBankName(acc.bank_name);
      setAccountName(acc.account_name);
      setAccountNumber(acc.account_number);
      setMobileMoney(acc.mobile_money_number);
      setNotes(acc.notes);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDivisionAccount(selectedDiv, {
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
      mobile_money_number: mobileMoney,
      notes: notes,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center text-xs text-[#C84B1A] font-bold">
        Super Admin authorization required to manage division payment accounts.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-jakarta max-w-4xl mx-auto">
      
      <div>
        <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-wider">Super Admin Governance</span>
        <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Division Payment Account Settings</h1>
        <p className="text-xs text-[#8A9AAF] mt-1">
          Configure bank account details and mobile money instructions displayed to clients on payment screens per division.
        </p>
      </div>

      {/* Division Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {(['garment', 'digital', 'consulting', 'branding'] as const).map(div => (
          <button
            key={div}
            onClick={() => handleSelectDiv(div)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
              selectedDiv === div
                ? 'bg-[#06D6A0] text-[#080A0F] shadow-lg'
                : 'bg-[#111318] text-[#8A9AAF] hover:text-white border border-white/10'
            }`}
          >
            {div === 'garment' ? 'B-VIBE Garment' : div === 'digital' ? 'Tˣ Digital Agency' : div === 'consulting' ? 'Strategic Advisory' : 'Branding & Promotion'}
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#06D6A0]/20 border border-[#06D6A0] text-[#06D6A0] rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Division payment account settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Bank Name</label>
            <input
              type="text"
              required
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#06D6A0] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Account Holder Name</label>
            <input
              type="text"
              required
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#06D6A0] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Account Number</label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] font-mono-code focus:border-[#06D6A0] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Mobile Money Number (Telebirr / M-PESA)</label>
            <input
              type="text"
              required
              value={mobileMoney}
              onChange={e => setMobileMoney(e.target.value)}
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#06D6A0] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#8A9AAF] uppercase font-bold text-xs mb-1">Client Wire Notes & Directives</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] text-xs outline-none focus:border-[#06D6A0]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" /> Save Division Account Configuration
        </button>
      </form>

    </div>
  );
}
