"use client";
import { useEffect, useRef } from "react";

interface ProgressRingProps {
  value: number;       // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  label?: string;
  animated?: boolean;
}

export default function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color = "#F9C6D0",
  trackColor,
  children,
  label,
  animated = true,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!animated || !circleRef.current) return;
    circleRef.current.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
          circleRef.current.style.strokeDashoffset = String(offset);
        }
      }, 100);
    });
  }, [value, offset, circumference, animated]);

  const center = size / 2;
  const track = trackColor || "rgba(249,198,208,0.15)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="glow-ring -rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          style={!animated ? { strokeDashoffset: offset } : undefined}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
        {label && <p className="text-[9px] font-medium text-gray-400 mt-0.5">{label}</p>}
      </div>
    </div>
  );
}

// Macro progress bar
export function MacroBar({
  label,
  value,
  max,
  color,
  unit = "g",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}) {
  const pct = Math.min(100, (value / Math.max(max, 1)) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-500 dark:text-gray-500">
          {Math.round(value)}/{Math.round(max)}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
