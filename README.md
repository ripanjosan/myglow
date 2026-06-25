# 🌸 MyGlow – Personal AI Wellness PWA

> Glow into your best self. Powered by Ripan AI.

A complete, production-quality personal wellness Progressive Web App built for one user. Beautiful, fast, offline-first, and installable on iPhone Safari.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 Dashboard | Glow Score, calories, water, habits, mood, BMI at a glance |
| 🥗 Nutrition | 80+ Indian vegetarian foods, custom foods, meal logging |
| 💧 Water Tracker | Animated bottle, quick-add, weekly charts |
| ⚖️ Weight | BMI, goal tracking, trend chart |
| ✅ Habits | Streaks, custom habits, weekly overview |
| 💝 Mood | Energy, stress, sleep, weekly analysis |
| ✨ Journal | 369 method, gratitude, morning/night journal, affirmations |
| 📅 Planner | Daily routine with morning/afternoon/evening blocks |
| 🏋️ Fitness | Steps, workouts, achievements |
| 📊 Progress | Weekly/monthly charts for all metrics |
| 🤖 Ripan AI | Full AI chat powered by Claude Sonnet |
| ⚙️ Settings | Profile, goals, theme, export/import data |

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Clone or extract the project
cd myglow

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📱 Install on iPhone (PWA)

1. Open Safari on your iPhone
2. Go to the deployed URL (e.g., `https://myglow.vercel.app`)
3. Tap the **Share** button (box with arrow up)
4. Tap **"Add to Home Screen"**
5. Tap **"Add"**

MyGlow will appear as an app on your home screen! 🌸

---

## ☁️ Deployment (Vercel — Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — it auto-detects Next.js
```

Or deploy via GitHub:
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy — done in 2 minutes!

### Environment Variables
No environment variables needed. The Anthropic API is called from the browser directly via the claude.ai artifact API proxy.

---

## 🏗️ Project Structure

```
myglow/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons (72–512px)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Home dashboard
│   │   ├── nutrition/         # Food tracker
│   │   ├── water/             # Water tracker
│   │   ├── habits/            # Habit tracker
│   │   ├── mood/              # Mood tracker
│   │   ├── manifestation/     # Journal & 369 method
│   │   ├── progress/          # Charts & analytics
│   │   ├── ai/                # Ripan AI chat
│   │   ├── weight/            # Weight tracker
│   │   ├── planner/           # Daily planner
│   │   ├── fitness/           # Steps & workouts
│   │   ├── settings/          # App settings
│   │   └── more/              # Navigation hub
│   ├── components/
│   │   ├── ai/                # RipanAIWidget
│   │   ├── layout/            # BottomNav, PageHeader
│   │   └── ui/                # Card, ProgressRing, Toast, ThemeProvider
│   ├── lib/
│   │   ├── db.ts              # Dexie.js database (80+ Indian foods)
│   │   └── utils.ts           # Utility functions
│   └── styles/
│       └── globals.css        # Tailwind + custom styles
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database (IndexedDB via Dexie.js)

All data stored locally in the browser — **no backend, no cloud, no tracking**.

| Table | Description |
|-------|-------------|
| `foods` | 80+ Indian vegetarian food items |
| `mealLogs` | Daily meal entries |
| `waterLogs` | Water intake logs |
| `weightLogs` | Weight history |
| `habitDefinitions` | Habit configurations |
| `habitLogs` | Daily habit completions |
| `moodLogs` | Mood, energy, stress, sleep logs |
| `journalEntries` | Journal and manifestation entries |
| `plannerItems` | Daily planner tasks |
| `stepLogs` | Step count history |
| `settings` | User profile and preferences |
| `achievements` | Unlocked achievements |

---

## 🤖 Ripan AI

Powered by Claude claude-sonnet-4-6. The AI assistant:
- Analyzes your daily nutrition
- Suggests Indian vegetarian meals
- Tracks your water and habit progress
- Provides gentle, personalized wellness advice
- Generates manifestation prompts
- Never guilt-trips, always encourages

The API is called directly from the browser. No API key needed when running through claude.ai.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Pink | `#F9C6D0` |
| Lavender | `#C8B6E2` |
| Cream | `#FFF8F5` |
| Gold | `#D4A853` |
| Rose | `#E8748A` |
| Font Display | Playfair Display |
| Font Body | Plus Jakarta Sans |

---

## 📊 Glow Score Calculation

| Factor | Weight |
|--------|--------|
| Calorie tracking | 15 pts |
| Protein goal | 15 pts |
| Water intake | 20 pts |
| Habit completion | 30 pts |
| Mood logged | 10 pts |
| Journal entry | 10 pts |
| **Total** | **100 pts** |

---

## 🔒 Privacy

- **All data is stored locally** on your device using IndexedDB
- No data is sent to any server (except Ripan AI queries to Anthropic)
- No account required
- No tracking, no analytics, no ads
- Export your data anytime from Settings

---

## 💾 Data Backup

1. Go to **Settings → Export Data**
2. A JSON file will download to your device
3. To restore: **Settings → Import Data** → select the JSON file

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Smooth animations |
| Dexie.js | IndexedDB ORM |
| Chart.js | Data visualization |
| date-fns | Date manipulation |
| Lucide React | Icons |
| Claude Sonnet 4.6 | Ripan AI assistant |

---

## 🌸 Made with love for Ripan

*"Glow into your best self."*

---

## 📄 License

Personal use only. Built exclusively for Ripan.
