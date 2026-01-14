'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface MetricCardProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  delay?: number;
  suffix?: string;
  animateValue?: boolean;
}

export default function MetricCard({
  value,
  label,
  description,
  icon,
  delay = 0,
  suffix = '',
  animateValue = true,
}: MetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  // Animate counter
  useEffect(() => {
    if (!isInView || !animateValue) return;

    const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
    if (isNaN(numericValue)) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value, animateValue]);

  const formattedValue = animateValue && typeof value === 'number'
    ? displayValue.toLocaleString()
    : value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="glass glass-border rounded-lg p-6 text-center hover:bg-white/5 transition-colors"
    >
      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            {icon}
          </div>
        </div>
      )}

      {/* Value */}
      <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">
        {formattedValue}{suffix}
      </div>

      {/* Label */}
      <div className="text-sm sm:text-base font-medium text-foreground mb-1">
        {label}
      </div>

      {/* Description */}
      {description && (
        <div className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </div>
      )}

      {/* Progress Bar (optional) */}
      {animateValue && isInView && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.2, duration: 1.5 }}
          className="mt-4 h-1 bg-accent/30 rounded-full origin-left"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: delay + 0.4, duration: 1.5 }}
            className="h-full bg-accent rounded-full origin-left"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
