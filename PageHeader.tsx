"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  emoji?: string;
}

export default function PageHeader({ title, subtitle, showBack = false, rightElement, emoji }: PageHeaderProps) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6 pt-2"
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} className="text-glow-rose" />
          </button>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-gradient flex items-center gap-2">
            {emoji && <span>{emoji}</span>}
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-dark-muted dark:text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </motion.div>
  );
}
