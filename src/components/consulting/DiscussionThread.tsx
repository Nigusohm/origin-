'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, ShieldCheck, Send, User } from 'lucide-react';
import { DiscussionComment } from '@/types';

const commentSchema = z.object({
  user_name: z.string().min(2, 'Name and Title are required'),
  content: z.string().min(5, 'Commentary must be at least 5 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface DiscussionThreadProps {
  resourceId: string;
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({ resourceId }) => {
  const [comments, setComments] = useState<DiscussionComment[]>([
    {
      id: 'c-1',
      resource_id: resourceId,
      user_name: 'Dawit Gebremedhin, Senior Partner',
      content: 'This AI operating model whitepaper provides crucial benchmarks for local data sovereignty. Our advisory team in Hawassa has implemented these exact hybrid pipelines with great success.',
      is_verified_pro: true,
      created_at: '2026-06-05',
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmitComment = (data: CommentFormData) => {
    const commentObj: DiscussionComment = {
      id: `comment_${Date.now()}`,
      resource_id: resourceId,
      user_name: data.user_name.trim(),
      content: data.content.trim(),
      is_verified_pro: false,
      created_at: new Date().toISOString().split('T')[0],
    };

    setComments(prev => [commentObj, ...prev]);
    reset();
  };

  return (
    <div className="bg-[#0C1420] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 font-cormorant text-xl font-bold text-[#F0EDE8]">
        <MessageSquare className="w-5 h-5 text-[#C8961E]" /> Executive Discussion Thread ({comments.length})
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3 bg-[#111318] p-4 rounded-xl border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              {...register('user_name')}
              placeholder="Your Name & Title (e.g. Dr. Almaz, Tech Director)"
              className="w-full bg-[#0C1420] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] focus:outline-none focus:border-[#C8961E]"
            />
            {errors.user_name && <p className="text-[10px] text-red-400 mt-1">{errors.user_name.message}</p>}
          </div>
        </div>
        <div>
          <textarea
            rows={3}
            {...register('content')}
            placeholder="Share professional insights or query authors..."
            className="w-full bg-[#0C1420] border border-white/10 rounded-xl p-3 text-xs text-[#F0EDE8] focus:outline-none focus:border-[#C8961E]"
          />
          {errors.content && <p className="text-[10px] text-red-400 mt-1">{errors.content.message}</p>}
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-[#C8961E] text-[#080A0F] font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#C8961E]/90 transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Submit Verified Commentary
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.map(c => (
          <div key={c.id} className="bg-[#111318] border border-white/5 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-[#F0EDE8]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#F0EDE8]">{c.user_name}</span>
                {c.is_verified_pro && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#C8961E]/20 text-[#C8961E] px-2 py-0.5 rounded-full font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Verified Pro
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8A9AAF]">{c.created_at}</span>
            </div>
            <p className="text-xs text-[#8A9AAF] leading-relaxed pl-8">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
