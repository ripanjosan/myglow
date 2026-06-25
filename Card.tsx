"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
  gradient?: string;
}

export default function Card({ children, className, onClick, animate = true, delay = 0, gradient }: CardProps) {
  const base = "glass-card p-4 relative overflow-hidden";
  const hoverClass = onClick ? "card-hover cursor-pointer select-none" : "";

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
        className={cn(base, hoverClass, className)}
        onClick={onClick}
        style={gradient ? { background: gradient } : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(base, hoverClass, className)}
      onClick={onClick}
      style={gradient ? { background: gradient } : undefined}
    >
      {children}
    </div>
  );
}

export function CardRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-semibold uppercase tracking-wider text-glow-rose/70 mb-1", className)}>{children}</p>;
}

export function MiniCard({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={cn("glass-card p-3 rounded-2xl", onClick ? "cursor-pointer active:scale-95 transition-transform" : "", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
