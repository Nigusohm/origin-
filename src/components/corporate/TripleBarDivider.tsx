import React from 'react';
import { motion } from 'framer-motion';

interface TripleBarDividerProps {
  className?: string;
}

export const TripleBarDivider: React.FC<TripleBarDividerProps> = ({ className = 'my-8' }) => {
  return (
    <div className={`flex flex-col gap-2 w-full max-w-4xl mx-auto overflow-hidden ${className}`}>
      {[0, 150, 300].map((delayMs, idx) => (
        <motion.div
          key={idx}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delayMs / 1000, ease: 'easeInOut' }}
          style={{ transformOrigin: 'left' }}
          className="h-[2px] bg-gradient-to-r from-[#C8961E] via-[#E2DDD6] to-[#C8961E] opacity-80"
        />
      ))}
    </div>
  );
};
