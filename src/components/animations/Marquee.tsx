import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  items,
  speed = 20,
  direction = 'left',
  className = '',
  itemClassName = '',
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex w-full ${className}`}>
      <motion.div
        className="flex whitespace-nowrap shrink-0"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {/* Double the items to ensure seamless looping */}
        {[...items, ...items].map((item, index) => (
          <span key={index} className={`mx-4 sm:mx-8 ${itemClassName}`}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
