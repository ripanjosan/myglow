"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { getTodayNutrition, getTodayWater, getSetting, getTodayString } from "@/lib/db";

interface RipanAIWidgetProps {
  compact?: boolean;
}

const TIPS = [
  "💧 Try to drink a glass of water before every meal to boost metabolism and reduce overeating.",
  "🌿 Sprouts are a great protein booster! Add them to your breakfast for extra energy.",
  "🍋 Start your morning with warm lemon water to kickstart digestion and detox.",
  "🧘 Even 5 minutes of meditation can significantly reduce cortisol levels.",
  "🥗 Fill half your plate with vegetables — they're low in calories but rich in nutrients.",
  "💤 Getting 7-8 hours of sleep is as important as diet and exercise for weight management.",
  "🏃 A 20-minute walk after meals can boost digestion and lower blood sugar spikes.",
  "🫘 Dal and chole are excellent protein sources — perfect for Indian vegetarian diet!",
];

export default function RipanAIWidget({ compact }: RipanAIWidgetProps) {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    const idx = new Date().getHours() % TIPS.length;
    setTip(TIPS[idx]);
    loadPersonalizedTip();
  }, []);

  async function loadPersonalizedTip() {
    setLoading(true);
    try {
      const today = getTodayString();
      const [nutrition, water, calorieGoal, waterGoal, name] = await Promise.all([
        getTodayNutrition(today),
        getTodayWater(today),
        getSetting("calorieGoal"),
        getSetting("waterGoal"),
        getSetting("name"),
      ]);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are Ripan AI, a warm, encouraging personal wellness companion for ${name || "Ripan"}. She eats mostly Indian vegetarian food. Give one short, specific, actionable wellness tip (2-3 sentences max) based on her current data. Be gentle, motivating, and specific. No bullet points. Just a warm, helpful message. End with a relevant emoji.`,
          messages: [{
            role: "user",
            content: `Today's data:
- Calories: ${Math.round(nutrition.calories)} / ${calorieGoal || 1800} kcal
- Protein: ${Math.round(nutrition.protein)}g
- Water: ${Math.round(water)}ml / ${waterGoal || 2500}ml
- Time: ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}

Give me one specific wellness tip for right now.`
          }],
        }),
      });

      const data = await response.json();
      if (data.content?.[0]?.text) {
        setTip(data.content[0].text);
        setPersonalized(true);
      }
    } catch {
      // Use default tip
    }
    setLoading(false);
  }

  if (compact) {
    return (
      <Card
        gradient="linear-gradient(135deg, rgba(249,198,208,0.2) 0%, rgba(200,182,226,0.2) 100%)"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-glow-pink to-glow-lavender flex items-center justify-center flex-shrink-0 shadow-glow">
            {loading ? <Loader2 size={18} className="text-white animate-spin" /> : <Sparkles size={18} className="text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-xs font-bold text-gradient">Ripan AI</p>
              {personalized && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-glow-pink/20 text-glow-rose font-semibold">Personalized</span>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={tip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {loading ? "Getting your personalized tip..." : tip}
              </motion.p>
            </AnimatePresence>
          </div>
          <Link href="/ai">
            <ChevronRight size={18} className="text-glow-rose flex-shrink-0" />
          </Link>
        </div>
      </Card>
    );
  }

  return null;
}
