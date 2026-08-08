'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, ShieldCheck, Send, User } from 'lucide-react';
import { Review } from '@/types';

const reviewSchema = z.object({
  user_name: z.string().min(2, 'Name must be at least 2 characters'),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
  rating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewBlockProps {
  productId: string;
}

export const ReviewBlock: React.FC<ReviewBlockProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      product_id: productId,
      user_name: 'Bethlehem Tsegaye',
      rating: 5,
      comment: 'The Sheger Habesha silk embroidery on this dress is exquisite! Received so many compliments during our family Timkat gathering.',
      is_verified_buyer: true,
      created_at: '2026-05-18',
    },
    {
      id: 'rev-2',
      product_id: productId,
      user_name: 'Ato Yonas Tesfaye',
      rating: 5,
      comment: 'We ordered 120 corporate tailored blazers for our bank branch staff. The B-VIBE wholesale team delivered ahead of schedule with immaculate fitting.',
      is_verified_buyer: true,
      created_at: '2026-06-02',
    },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      user_name: '',
      comment: '',
    },
  });

  const selectedRating = watch('rating');

  const onReviewSubmit = (data: ReviewFormData) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      product_id: productId,
      user_name: data.user_name.trim(),
      rating: data.rating,
      comment: data.comment.trim(),
      is_verified_buyer: true,
      created_at: new Date().toISOString().split('T')[0],
    };

    setReviews(prev => [newRev, ...prev]);
    reset();
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
      
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold font-cormorant text-[#F5EEE4]">Verified Customer Reviews</h3>
          <p className="text-xs text-[#8A9AAF] mt-0.5">Real feedback from retail buyers and B2B wholesale corporate accounts.</p>
        </div>

        <div className="flex items-center gap-3 bg-[#111318] px-4 py-2.5 rounded-2xl border border-white/10">
          <div className="text-2xl font-bold text-[#C84B1A] font-jakarta">{avgRating}</div>
          <div>
            <div className="flex items-center gap-0.5 text-[#C84B1A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < Math.round(Number(avgRating)) ? 'text-[#C84B1A]' : 'text-white/20'}`} />
              ))}
            </div>
            <div className="text-[10px] text-[#8A9AAF] mt-0.5">{reviews.length} Verified Reviews</div>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit(onReviewSubmit)} className="bg-[#111318] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4B896]">Write a Review</h4>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A9AAF]">Your Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star)}
                className="text-[#C84B1A] hover:scale-110 transition-transform"
              >
                <Star className={`w-4 h-4 ${star <= selectedRating ? 'fill-current text-[#C84B1A]' : 'text-white/20'}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            type="text"
            {...register('user_name')}
            placeholder="Your Name (e.g. Sara Assefa)"
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
          />
          {errors.user_name && <p className="text-[10px] text-red-400 mt-1">{errors.user_name.message}</p>}
        </div>

        <div>
          <textarea
            rows={3}
            {...register('comment')}
            placeholder="Share your experience with fit, fabric quality, or delivery..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
          />
          {errors.comment && <p className="text-[10px] text-red-400 mt-1">{errors.comment.message}</p>}
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase flex items-center gap-1.5 hover:bg-[#C84B1A]/90 transition-colors shadow-md"
        >
          <Send className="w-3.5 h-3.5" /> Post Verified Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-[#111318] border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-[#F5EEE4]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#F5EEE4]">{rev.user_name}</span>
                {rev.is_verified_buyer && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#06D6A0]/15 text-[#06D6A0] px-2 py-0.5 rounded-full font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8A9AAF]">{rev.created_at}</span>
            </div>

            <div className="flex items-center gap-0.5 text-[#C84B1A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 fill-current ${i < rev.rating ? 'text-[#C84B1A]' : 'text-white/20'}`} />
              ))}
            </div>

            <p className="text-xs text-[#8A9AAF] leading-relaxed pl-8">{rev.comment}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
