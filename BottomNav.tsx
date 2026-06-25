"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, Droplets, BarChart2, Sparkles, BookHeart, Activity, Calendar, Settings } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/water", label: "Water", icon: Droplets },
  { href: "/habits", label: "Habits", icon: Activity },
  { href: "/mood", label: "Mood", icon: BookHeart },
  { href: "/manifestation", label: "Journal", icon: Sparkles },
  { href: "/progress", label: "Progress", icon: BarChart2 },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Show only 5 tabs on mobile, rest accessible through "More"
const primaryTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/nutrition", label: "Eat", icon: Utensils },
  { href: "/water", label: "Water", icon: Droplets },
  { href: "/habits", label: "Habits", icon: Activity },
  { href: "/progress", label: "Progress", icon: BarChart2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="glass mx-4 mb-3 rounded-3xl px-2 py-1.5 shadow-glow flex items-center gap-0.5 w-full max-w-md">
        {primaryTabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`nav-tab flex-1 ${isActive ? "active" : ""}`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(249,198,208,0.15)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="relative">
                <tab.icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={isActive ? "text-glow-rose" : ""}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-glow-rose"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}

        {/* More button leading to other pages */}
        <Link href="/more" className={`nav-tab flex-1 ${["/mood", "/manifestation", "/planner", "/settings", "/more", "/weight", "/ai"].some(p => pathname.startsWith(p)) ? "active" : ""}`}>
          <div className="flex flex-col items-center gap-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="19" cy="12" r="1.5"/>
            </svg>
            <span className="text-[10px] font-medium">More</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
