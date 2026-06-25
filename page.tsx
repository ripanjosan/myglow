"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Droplets, Utensils, Activity, Heart, Moon, Footprints,
  Sparkles, ChevronRight, Weight, TrendingUp, Flame
} from "lucide-react";
import ProgressRing, { MacroBar } from "@/components/ui/ProgressRing";
import Card from "@/components/ui/Card";
import {
  db, getTodayNutrition, getTodayWater, calculateGlowScore, seedDatabase, getSetting, getTodayString
} from "@/lib/db";
import { getGreeting, getTodayQuote, formatWater, calculateBMI, getBMICategory } from "@/lib/utils";
import { format } from "date-fns";
import RipanAIWidget from "@/components/ai/RipanAIWidget";

interface DashboardData {
  name: string;
  glowScore: number;
  calories: number;
  calorieGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  fat: number;
  water: number;
  waterGoal: number;
  steps: number;
  stepGoal: number;
  weight: number;
  goalWeight: number;
  height: number;
  mood: number | null;
  sleep: number | null;
  habitsCompleted: number;
  habitsTotal: number;
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await seedDatabase();
      const today = getTodayString();

      const [name, calorieGoal, proteinGoal, waterGoal, stepGoal, weightStr, goalWeightStr, heightStr] = await Promise.all([
        getSetting("name"),
        getSetting("calorieGoal"),
        getSetting("proteinGoal"),
        getSetting("waterGoal"),
        getSetting("stepGoal"),
        getSetting("currentWeight"),
        getSetting("goalWeight"),
        getSetting("height"),
      ]);

      const [nutrition, water, glowScore] = await Promise.all([
        getTodayNutrition(today),
        getTodayWater(today),
        calculateGlowScore(today),
      ]);

      const stepLog = await db.stepLogs.where("date").equals(today).first();
      const moodLog = await db.moodLogs.where("date").equals(today).first();
      const activeHabits = await db.habitDefinitions.where("isActive").equals(1).toArray();
      const completedHabits = await db.habitLogs.where("date").equals(today).filter(l => l.completed).count();

      setData({
        name: name || "Ripan",
        glowScore,
        calories: nutrition.calories,
        calorieGoal: parseInt(calorieGoal || "1800"),
        protein: nutrition.protein,
        proteinGoal: parseInt(proteinGoal || "100"),
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        water,
        waterGoal: parseInt(waterGoal || "2500"),
        steps: stepLog?.steps || 0,
        stepGoal: parseInt(stepGoal || "8000"),
        weight: parseFloat(weightStr || "70"),
        goalWeight: parseFloat(goalWeightStr || "65"),
        height: parseFloat(heightStr || "170"),
        mood: moodLog?.mood ?? null,
        sleep: moodLog?.sleep ?? null,
        habitsCompleted: completedHabits,
        habitsTotal: activeHabits.length,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!data) return null;

  const bmi = calculateBMI(data.weight, data.height);
  const bmiInfo = getBMICategory(bmi);
  const calRemaining = data.calorieGoal - data.calories;
  const greeting = getGreeting(data.name);
  const quote = getTodayQuote();
  const today = new Date();
  const moodEmojis = ["", "😔", "😐", "🙂", "😊", "🌟"];

  return (
    <div className="page-container pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 pb-2 flex items-start justify-between"
      >
        <div>
          <p className="text-xs font-medium text-glow-rose/70 uppercase tracking-widest mb-0.5">
            {format(today, "EEEE, d MMM")}
          </p>
          <h1 className="font-display text-2xl font-bold text-gradient leading-tight">
            {greeting}
          </h1>
          <p className="text-xs text-gray-400 mt-1 italic">{quote}</p>
        </div>
        <Link href="/settings">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-glow-pink to-glow-lavender flex items-center justify-center shadow-glow animate-float">
            <span className="text-xl">🌸</span>
          </div>
        </Link>
      </motion.div>

      {/* Glow Score + Key Metrics */}
      <Card className="mt-4" delay={0.05}>
        <div className="flex items-center gap-4">
          {/* Glow Score Ring */}
          <div className="relative">
            <ProgressRing
              value={data.glowScore}
              size={88}
              strokeWidth={7}
              color="#F9C6D0"
              trackColor="rgba(249,198,208,0.12)"
            >
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold font-display text-gradient">{data.glowScore}</span>
                <span className="text-[8px] font-semibold text-glow-rose/60 uppercase tracking-wider">Glow</span>
              </div>
            </ProgressRing>
          </div>

          {/* Quick stats */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            <QuickStat
              icon={<Flame size={14} className="text-glow-rose" />}
              label="Calories Left"
              value={calRemaining > 0 ? `${Math.round(calRemaining)}` : "0"}
              sub="kcal"
              color={calRemaining < 0 ? "#EF4444" : undefined}
            />
            <QuickStat
              icon={<Droplets size={14} className="text-blue-400" />}
              label="Water"
              value={formatWater(data.water)}
              sub={`/ ${formatWater(data.waterGoal)}`}
            />
            <QuickStat
              icon={<Activity size={14} className="text-emerald-400" />}
              label="Habits"
              value={`${data.habitsCompleted}/${data.habitsTotal}`}
              sub="done"
            />
            <QuickStat
              icon={<Heart size={14} className="text-pink-400" />}
              label="Mood"
              value={data.mood ? moodEmojis[data.mood] : "—"}
              sub={data.mood ? ["", "Low", "Okay", "Good", "Great", "Amazing"][data.mood] : "Log it"}
            />
          </div>
        </div>

        {/* Today's Mission */}
        <div className="mt-4 pt-4 border-t border-glow-pink/10">
          <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider mb-2">Today's Mission</p>
          <div className="flex gap-2 flex-wrap">
            {data.water < data.waterGoal && (
              <MissionChip href="/water" emoji="💧" label={`${formatWater(data.waterGoal - data.water)} more water`} />
            )}
            {data.protein < data.proteinGoal && (
              <MissionChip href="/nutrition" emoji="💪" label={`${Math.round(data.proteinGoal - data.protein)}g protein needed`} />
            )}
            {data.habitsCompleted < data.habitsTotal && (
              <MissionChip href="/habits" emoji="✅" label={`${data.habitsTotal - data.habitsCompleted} habits left`} />
            )}
            {!data.mood && (
              <MissionChip href="/mood" emoji="💝" label="Log your mood" />
            )}
            {data.calories === 0 && (
              <MissionChip href="/nutrition" emoji="🥗" label="Log breakfast" />
            )}
          </div>
        </div>
      </Card>

      {/* Nutrition Summary */}
      <Card className="mt-4" delay={0.1}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-glow-pink/20 flex items-center justify-center">
              <Utensils size={16} className="text-glow-rose" />
            </div>
            <div>
              <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider">Nutrition</p>
              <p className="text-sm font-bold">{Math.round(data.calories)} / {data.calorieGoal} kcal</p>
            </div>
          </div>
          <Link href="/nutrition" className="btn-ghost py-1.5 px-3 text-xs">
            Log <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-2.5">
          <MacroBar label="Protein" value={data.protein} max={data.proteinGoal} color="#C8B6E2" />
          <MacroBar label="Carbs" value={data.carbs} max={data.calorieGoal * 0.55 / 4} color="#93C5FD" />
          <MacroBar label="Fat" value={data.fat} max={data.calorieGoal * 0.3 / 9} color="#FCD34D" />
        </div>
      </Card>

      {/* Stats Row */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Weight & BMI */}
        <Card delay={0.15} className="col-span-1">
          <Link href="/weight">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-glow-lavender/20 flex items-center justify-center">
                <Weight size={14} className="text-glow-lavender-deep" />
              </div>
              <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider">Weight</p>
            </div>
            <p className="font-display text-2xl font-bold">{data.weight}<span className="text-sm font-normal text-gray-400">kg</span></p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${bmiInfo.color}20`, color: bmiInfo.color }}>
                BMI {bmi} · {bmiInfo.label}
              </span>
            </div>
          </Link>
        </Card>

        {/* Steps */}
        <Card delay={0.18} className="col-span-1">
          <Link href="/fitness">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <Footprints size={14} className="text-emerald-500" />
              </div>
              <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider">Steps</p>
            </div>
            <p className="font-display text-2xl font-bold">{data.steps.toLocaleString()}</p>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mt-2">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${Math.min(100, (data.steps / data.stepGoal) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Goal: {data.stepGoal.toLocaleString()}</p>
          </Link>
        </Card>
      </div>

      {/* Ripan AI Widget */}
      <div className="mt-4">
        <RipanAIWidget compact />
      </div>

      {/* Quick Actions */}
      <Card className="mt-4" delay={0.25}>
        <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider mb-3">Quick Access</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { href: "/manifestation", emoji: "✨", label: "Journal" },
            { href: "/mood", emoji: "💝", label: "Mood" },
            { href: "/planner", emoji: "📅", label: "Planner" },
            { href: "/ai", emoji: "🤖", label: "Ripan AI" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-glow-blush dark:bg-dark-surface hover:bg-glow-pink/20 transition-colors active:scale-95">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Weekly Glow */}
      <WeeklyGlowStrip />

      {/* Sleep if logged */}
      {data.sleep && (
        <Card className="mt-4" delay={0.3}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
              <Moon size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider">Last Night's Sleep</p>
              <p className="text-lg font-bold">{data.sleep}h <span className="text-sm font-normal text-gray-400">of sleep</span></p>
            </div>
            <Link href="/mood" className="ml-auto btn-ghost py-1.5 px-3 text-xs">
              Edit <ChevronRight size={14} />
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

function QuickStat({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5 bg-glow-blush/40 dark:bg-dark-surface/50 rounded-2xl p-2.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      </div>
      <p className="font-bold text-base leading-none" style={color ? { color } : undefined}>{value}</p>
      <p className="text-[9px] text-gray-400">{sub}</p>
    </div>
  );
}

function MissionChip({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link href={href}>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-glow-blush dark:bg-dark-surface text-xs font-medium text-glow-rose dark:text-glow-pink border border-glow-pink/20 active:scale-95 transition-transform">
        {emoji} {label}
      </span>
    </Link>
  );
}

function WeeklyGlowStrip() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const currentIdx = today === 0 ? 6 : today - 1;

  return (
    <Card className="mt-4" delay={0.28}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-glow-rose/60 uppercase tracking-wider">This Week</p>
        <Link href="/progress" className="text-xs text-glow-rose font-medium">See all →</Link>
      </div>
      <div className="flex justify-between">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                i < currentIdx
                  ? "bg-gradient-to-br from-glow-pink to-glow-lavender shadow-glow"
                  : i === currentIdx
                  ? "bg-glow-pink/30 border-2 border-glow-pink"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {i < currentIdx ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i === currentIdx ? (
                <span className="text-xs">🌸</span>
              ) : (
                <span className="text-[10px] text-gray-300">·</span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${i === currentIdx ? "text-glow-rose" : "text-gray-400"}`}>{day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="page-container space-y-4 pt-6">
      <div className="skeleton h-16 w-3/4" />
      <div className="skeleton h-40 w-full" />
      <div className="skeleton h-32 w-full" />
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
      </div>
    </div>
  );
}
