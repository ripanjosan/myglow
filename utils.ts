import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name} 🌸`;
  if (hour < 17) return `Good Afternoon, ${name} ✨`;
  if (hour < 21) return `Good Evening, ${name} 🌙`;
  return `Good Night, ${name} 💫`;
}

export function formatCalories(cal: number): string {
  return Math.round(cal).toLocaleString();
}

export function formatNumber(n: number, decimals = 1): string {
  return Number(n.toFixed(decimals)).toString();
}

export function formatWater(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${Math.round(ml)}ml`;
}

export function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export const DAILY_QUOTES = [
  "Your body is your most precious possession. Take care of it. 🌸",
  "Small steps every day lead to big transformations. ✨",
  "Nourish yourself from the inside out. 💕",
  "You are one workout away from a good mood. 🧘",
  "Glow is not just in your skin—it's in your soul. 🌟",
  "Consistency is the key to your dream body and mind. 🗝️",
  "Every healthy choice is an act of self-love. 💖",
  "Your future self is watching. Make her proud. 👸",
  "Wellness is a journey, not a destination. 🌺",
  "The secret of getting ahead is getting started. 🚀",
  "Drink your water. Eat your veggies. Rest your soul. 🌿",
  "You glow differently when you truly take care of yourself. ✨",
  "Today is a fresh start. A new beginning. A clean slate. 🌅",
  "Be gentle with yourself. You are growing. 🌱",
  "Self-care is not selfish. It is essential. 💫",
];

export function getTodayQuote(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

export function getBMICategory(bmi: number): { label: string; color: string; emoji: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#60A5FA", emoji: "💙" };
  if (bmi < 25) return { label: "Healthy Weight", color: "#34D399", emoji: "💚" };
  if (bmi < 30) return { label: "Overweight", color: "#FBBF24", emoji: "💛" };
  return { label: "Obese", color: "#EF4444", emoji: "❤️" };
}

export function calculateBMI(weight: number, heightCm: number): number {
  const h = heightCm / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

export function estimateGoalDate(current: number, goal: number, weeklyLoss = 0.5): string {
  const diff = Math.abs(current - goal);
  const weeks = Math.ceil(diff / weeklyLoss);
  const date = new Date();
  date.setDate(date.getDate() + weeks * 7);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function getStreakCount(logs: Array<{ date: string; completed?: boolean }>): number {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = logs.find((l) => l.date === dateStr && (l.completed === undefined || l.completed));
    if (log) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function getMacroColor(macro: "calories" | "protein" | "carbs" | "fat" | "fiber"): string {
  return {
    calories: "#F9C6D0",
    protein: "#C8B6E2",
    carbs: "#93C5FD",
    fat: "#FCD34D",
    fiber: "#6EE7B7",
  }[macro];
}
