'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MetricCounterProps {
  label: string;
  value: string;
  suffix?: string;
}

export const MetricCounter: React.FC<MetricCounterProps> = ({ label, value, suffix = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#111318] border border-[#2563EB]/30 p-6 rounded-2xl text-center shadow-lg"
    >
      <div className="text-3xl sm:text-4xl font-bold font-mono-code text-[#06D6A0]">
        {value} <span className="text-sm font-normal text-[#2563EB]">{suffix}</span>
      </div>
      <div className="text-xs uppercase font-mono-code text-[#8A9AAF] mt-2 tracking-wider">
        {label}
      </div>
    </motion.div>
  );
};
