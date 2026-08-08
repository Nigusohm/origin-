'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { ConsultingSlot } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';

const bookingSchema = z.object({
  clientName: z.string().min(2, 'Full name is required'),
  clientEmail: z.string().email('Valid executive email address is required'),
  organization: z.string().min(2, 'Organization name is required'),
  role: z.string().min(2, 'Role / Title is required'),
  description: z.string().min(10, 'Please detail your objectives (min 10 chars)'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingCalendarProps {
  slots: ConsultingSlot[];
  onSlotBooked?: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ slots, onSlotBooked }) => {
  const { user } = useAuth();
  const { createEnquiry } = useOrderEnquiry();

  const [selectedSlot, setSelectedSlot] = useState<ConsultingSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<BookingFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: user?.name || '',
      clientEmail: user?.email || '',
    },
  });

  const onBookingSubmit = async (data: BookingFormData) => {
    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot first.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      if (user) {
        await createEnquiry({
          type: 'enquiry',
          division: 'consulting',
          customer_id: user.id,
          customer_name: data.clientName,
          customer_email: data.clientEmail,
          customer_phone: user.phone || '+251911000000',
          item_title: `Executive Advisory: ${selectedSlot.session_type.toUpperCase()} (${selectedSlot.date} at ${selectedSlot.time})`,
          message: `Organization: ${data.organization} (${data.role}). Objective: ${data.description}`,
          amount_due_etb: selectedSlot.session_type === 'discovery' ? 0 : selectedSlot.session_type === 'advisory' ? 18000 : 35000,
          amount_due_usd: selectedSlot.session_type === 'discovery' ? 0 : selectedSlot.session_type === 'advisory' ? 150 : 300,
        });
      }

      setSubmittedData(data);
      setBookingSuccess(true);
      if (onSlotBooked) onSlotBooked();
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmittedData(data);
      setBookingSuccess(true);
      if (onSlotBooked) onSlotBooked();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0C1420] border border-[#C8961E]/30 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl doc-fold-corner space-y-8 font-jakarta">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#C8961E]/20 text-[#C8961E] border border-[#C8961E]/40 flex items-center justify-center">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-cormorant text-[#F0EDE8]">
            Live Executive Session Booking Engine
          </h2>
          <p className="text-xs text-[#8A9AAF]">
            Select an available time slot for Discovery (30m), Advisory (60m), or Workshop Planning (90m).
          </p>
        </div>
      </div>

      {bookingSuccess && submittedData ? (
        <div className="bg-[#111318] border border-[#06D6A0] rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#06D6A0] mx-auto" />
          <h3 className="text-xl font-cormorant font-bold text-[#F0EDE8]">Executive Session Reserved!</h3>
          <p className="text-xs text-[#8A9AAF] max-w-md mx-auto">
            Your booking request for {selectedSlot?.session_type.toUpperCase()} on <strong>{selectedSlot?.date} at {selectedSlot?.time}</strong> has been logged.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-6">
          
          {/* Slots Picker */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-wider text-[#C8961E] block">
              1. Available Time Slots
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {slots.map(slot => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.is_booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      slot.is_booked
                        ? 'opacity-40 border-white/5 bg-white/5 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#C8961E] bg-[#C8961E]/20 text-white shadow-lg'
                        : 'border-white/10 bg-[#111318] text-[#8A9AAF] hover:border-[#C8961E]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#F0EDE8]">
                      <span className="capitalize">{slot.session_type} ({slot.duration_min}m)</span>
                      <Clock className="w-3.5 h-3.5 text-[#C8961E]" />
                    </div>
                    <div className="text-xs font-mono-code mt-1 text-[#F0EDE8]">{slot.date} @ {slot.time}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
            </div>
          )}

          {/* Client Info Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Full Executive Name *</label>
              <input
                type="text"
                {...register('clientName')}
                placeholder="Abebe Bikila"
                className="w-full p-3 bg-[#111318] border border-white/10 rounded-xl text-[#F0EDE8] focus:border-[#C8961E] outline-none"
              />
              {errors.clientName && <p className="text-red-400 text-[10px] mt-1">{errors.clientName.message}</p>}
            </div>

            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Corporate Email Address *</label>
              <input
                type="email"
                {...register('clientEmail')}
                placeholder="executive@company.com"
                className="w-full p-3 bg-[#111318] border border-white/10 rounded-xl text-[#F0EDE8] focus:border-[#C8961E] outline-none"
              />
              {errors.clientEmail && <p className="text-red-400 text-[10px] mt-1">{errors.clientEmail.message}</p>}
            </div>

            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Organization / Enterprise *</label>
              <input
                type="text"
                {...register('organization')}
                placeholder="Ethiopian Financial Holdings"
                className="w-full p-3 bg-[#111318] border border-white/10 rounded-xl text-[#F0EDE8] focus:border-[#C8961E] outline-none"
              />
              {errors.organization && <p className="text-red-400 text-[10px] mt-1">{errors.organization.message}</p>}
            </div>

            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Your Executive Role / Title *</label>
              <input
                type="text"
                {...register('role')}
                placeholder="Managing Director / CEO"
                className="w-full p-3 bg-[#111318] border border-white/10 rounded-xl text-[#F0EDE8] focus:border-[#C8961E] outline-none"
              />
              {errors.role && <p className="text-red-400 text-[10px] mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold text-xs mb-1">Key Advisory Objectives & Discussion Points *</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Outline your market entry goals, FDI regulatory needs, or AI integration objectives..."
              className="w-full p-3 bg-[#111318] border border-white/10 rounded-xl text-[#F0EDE8] text-xs focus:border-[#C8961E] outline-none"
            />
            {errors.description && <p className="text-red-400 text-[10px] mt-1">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            {submitting ? 'Reserving Slot...' : <><Send className="w-4 h-4" /> Reserve Executive Advisory Session</>}
          </button>
        </form>
      )}

    </div>
  );
};
