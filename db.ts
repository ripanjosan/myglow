import Dexie, { Table } from "dexie";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface FoodItem {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: number;
  servingUnit: string;
  category: string;
  emoji?: string;
  isFavorite?: boolean;
  isCustom?: boolean;
}

export interface MealLog {
  id?: number;
  date: string;
  meal: "breakfast" | "lunch" | "dinner" | "snacks";
  foodId: number;
  foodName: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  createdAt: number;
}

export interface WaterLog {
  id?: number;
  date: string;
  amount: number;
  createdAt: number;
}

export interface WeightLog {
  id?: number;
  date: string;
  weight: number;
  bmi: number;
  notes?: string;
  createdAt: number;
}

export interface HabitDefinition {
  id?: number;
  name: string;
  icon: string;
  color: string;
  targetDays: number[];
  isActive: boolean | number;
  createdAt: number;
}

export interface HabitLog {
  id?: number;
  habitId: number;
  date: string;
  completed: boolean;
  createdAt: number;
}

export interface MoodLog {
  id?: number;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  sleepQuality: number;
  notes?: string;
  tags?: string[];
  createdAt: number;
}

export interface JournalEntry {
  id?: number;
  date: string;
  type: "morning" | "night" | "gratitude" | "369" | "affirmations";
  content: string;
  gratitudeItems?: string[];
  affirmations?: string[];
  createdAt: number;
}

export interface PlannerItem {
  id?: number;
  date: string;
  time?: string;
  title: string;
  description?: string;
  category: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: number;
}

export interface StepLog {
  id?: number;
  date: string;
  steps: number;
  caloriesBurned: number;
  createdAt: number;
  updatedAt?: number;
}

export interface Setting {
  id?: number;
  key: string;
  value: string;
}

export interface Achievement {
  id?: number;
  key: string;
  unlockedAt: number;
}

// ─── Database ────────────────────────────────────────────────────────────────────

class MyGlowDB extends Dexie {
  foods!: Table<FoodItem>;
  mealLogs!: Table<MealLog>;
  waterLogs!: Table<WaterLog>;
  weightLogs!: Table<WeightLog>;
  habitDefinitions!: Table<HabitDefinition>;
  habitLogs!: Table<HabitLog>;
  moodLogs!: Table<MoodLog>;
  journalEntries!: Table<JournalEntry>;
  plannerItems!: Table<PlannerItem>;
  stepLogs!: Table<StepLog>;
  settings!: Table<Setting>;
  achievements!: Table<Achievement>;

  constructor() {
    super("MyGlowDB");
    this.version(1).stores({
      foods: "++id, name, category, isFavorite, isCustom",
      mealLogs: "++id, date, meal, foodId",
      waterLogs: "++id, date",
      weightLogs: "++id, date",
      habitDefinitions: "++id, isActive",
      habitLogs: "++id, habitId, date",
      moodLogs: "++id, date",
      journalEntries: "++id, date, type",
      plannerItems: "++id, date, completed",
      stepLogs: "++id, date",
      settings: "++id, key",
      achievements: "++id, key",
    });
  }
}

export const db = new MyGlowDB();

// ─── Helpers ─────────────────────────────────────────────────────────────────────

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getSetting(key: string): Promise<string | undefined> {
  const s = await db.settings.where("key").equals(key).first();
  return s?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const existing = await db.settings.where("key").equals(key).first();
  if (existing?.id) {
    await db.settings.update(existing.id, { value });
  } else {
    await db.settings.add({ key, value });
  }
}

export async function getTodayNutrition(date: string) {
  const logs = await db.mealLogs.where("date").equals(date).toArray();
  return {
    calories: logs.reduce((a, l) => a + l.calories, 0),
    protein: logs.reduce((a, l) => a + l.protein, 0),
    carbs: logs.reduce((a, l) => a + l.carbs, 0),
    fat: logs.reduce((a, l) => a + l.fat, 0),
    fiber: logs.reduce((a, l) => a + l.fiber, 0),
    sugar: logs.reduce((a, l) => a + l.sugar, 0),
    sodium: logs.reduce((a, l) => a + l.sodium, 0),
  };
}

export async function getTodayWater(date: string): Promise<number> {
  const logs = await db.waterLogs.where("date").equals(date).toArray();
  return logs.reduce((a, l) => a + l.amount, 0);
}

export function calculateBMI(weight: number, heightCm: number): number {
  const h = heightCm / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
}

export function getBMICategory(bmi: number): { label: string; color: string; emoji: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#60A5FA", emoji: "💙" };
  if (bmi < 25) return { label: "Healthy", color: "#34D399", emoji: "💚" };
  if (bmi < 30) return { label: "Overweight", color: "#FBBF24", emoji: "💛" };
  return { label: "Obese", color: "#EF4444", emoji: "❤️" };
}

export async function calculateGlowScore(date: string): Promise<number> {
  let score = 0;
  const nutrition = await getTodayNutrition(date);
  const calorieGoal = parseInt((await getSetting("calorieGoal")) || "1800");
  const proteinGoal = parseInt((await getSetting("proteinGoal")) || "100");
  if (nutrition.calories > 0) {
    score += Math.round(Math.min(1, nutrition.calories / calorieGoal) * 15);
    score += Math.round(Math.min(1, nutrition.protein / proteinGoal) * 15);
  }
  const water = await getTodayWater(date);
  const waterGoal = parseInt((await getSetting("waterGoal")) || "2500");
  score += Math.min(20, Math.round((water / waterGoal) * 20));
  const activeHabits = await db.habitDefinitions.where("isActive").equals(1).count();
  if (activeHabits > 0) {
    const completed = await db.habitLogs.where("date").equals(date).filter(l => l.completed).count();
    score += Math.round((completed / activeHabits) * 30);
  }
  const mood = await db.moodLogs.where("date").equals(date).count();
  if (mood > 0) score += 10;
  const journal = await db.journalEntries.where("date").equals(date).count();
  if (journal > 0) score += 10;
  return Math.min(100, score);
}

// ─── Food Database ───────────────────────────────────────────────────────────────

export const FOOD_DATABASE: Omit<FoodItem, "id">[] = [
  { name: "Chapati / Roti", calories: 104, protein: 3.1, carbs: 18, fat: 2.5, fiber: 2.5, sugar: 0.5, sodium: 130, servingSize: 1, servingUnit: "piece (40g)", category: "Breads", emoji: "🫓" },
  { name: "Whole Wheat Paratha", calories: 180, protein: 4.5, carbs: 26, fat: 7, fiber: 3, sugar: 0.5, sodium: 180, servingSize: 1, servingUnit: "piece (65g)", category: "Breads", emoji: "🫓" },
  { name: "Aloo Paratha", calories: 230, protein: 5, carbs: 35, fat: 9, fiber: 3.5, sugar: 1, sodium: 220, servingSize: 1, servingUnit: "piece (90g)", category: "Breads", emoji: "🫓" },
  { name: "Puri", calories: 128, protein: 2.5, carbs: 16, fat: 6, fiber: 1, sugar: 0.5, sodium: 80, servingSize: 1, servingUnit: "piece (40g)", category: "Breads", emoji: "🫓" },
  { name: "Naan", calories: 262, protein: 8.7, carbs: 47, fat: 5, fiber: 1.9, sugar: 3, sodium: 500, servingSize: 1, servingUnit: "piece (90g)", category: "Breads", emoji: "🍞" },
  { name: "Missi Roti", calories: 120, protein: 5, carbs: 19, fat: 3, fiber: 3, sugar: 0.5, sodium: 150, servingSize: 1, servingUnit: "piece (45g)", category: "Breads", emoji: "🫓" },
  { name: "Cooked White Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0, sodium: 0, servingSize: 100, servingUnit: "g", category: "Rice", emoji: "🍚" },
  { name: "Cooked Brown Rice", calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0, sodium: 0, servingSize: 100, servingUnit: "g", category: "Rice", emoji: "🍚" },
  { name: "Jeera Rice", calories: 150, protein: 3, carbs: 30, fat: 3, fiber: 0.5, sugar: 0, sodium: 200, servingSize: 100, servingUnit: "g", category: "Rice", emoji: "🍚" },
  { name: "Vegetable Pulao", calories: 165, protein: 4, carbs: 30, fat: 4, fiber: 2, sugar: 1, sodium: 250, servingSize: 100, servingUnit: "g", category: "Rice", emoji: "🍛" },
  { name: "Khichdi", calories: 140, protein: 5, carbs: 26, fat: 2.5, fiber: 3, sugar: 0.5, sodium: 300, servingSize: 100, servingUnit: "g", category: "Rice", emoji: "🍛" },
  { name: "Vegetable Biryani", calories: 185, protein: 5, carbs: 32, fat: 5.5, fiber: 2, sugar: 2, sodium: 400, servingSize: 100, servingUnit: "g", category: "Rice", emoji: "🍛" },
  { name: "Dal Tadka", calories: 115, protein: 7, carbs: 17, fat: 2.5, fiber: 4, sugar: 1, sodium: 350, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Dal Makhani", calories: 155, protein: 8, carbs: 18, fat: 6, fiber: 5, sugar: 1.5, sodium: 400, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Moong Dal", calories: 105, protein: 7, carbs: 15, fat: 1.5, fiber: 3.5, sugar: 1, sodium: 200, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Masoor Dal", calories: 116, protein: 9, carbs: 16, fat: 1, fiber: 4, sugar: 1, sodium: 250, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Chana Dal", calories: 130, protein: 8, carbs: 20, fat: 2, fiber: 5, sugar: 1, sodium: 200, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Urad Dal", calories: 120, protein: 8.5, carbs: 18, fat: 1.5, fiber: 4.5, sugar: 1, sodium: 180, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Rajma (Kidney Beans)", calories: 132, protein: 8.7, carbs: 22, fat: 0.8, fiber: 6.5, sugar: 1.5, sodium: 350, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫘" },
  { name: "Chole (Chickpea Curry)", calories: 148, protein: 8, carbs: 24, fat: 2, fiber: 6, sugar: 2, sodium: 300, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫘" },
  { name: "Sambar", calories: 85, protein: 4, carbs: 12, fat: 2.5, fiber: 3, sugar: 3, sodium: 400, servingSize: 100, servingUnit: "ml", category: "Lentils", emoji: "🫕" },
  { name: "Mixed Sprouts (raw)", calories: 87, protein: 7, carbs: 14, fat: 0.8, fiber: 5, sugar: 4, sodium: 14, servingSize: 100, servingUnit: "g", category: "Lentils", emoji: "🌱" },
  { name: "Boiled Chickpeas", calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 7, servingSize: 100, servingUnit: "g", category: "Lentils", emoji: "🫘" },
  { name: "Paneer (raw)", calories: 265, protein: 18, carbs: 3.5, fat: 20, fiber: 0, sugar: 1, sodium: 30, servingSize: 100, servingUnit: "g", category: "Dairy", emoji: "🧀" },
  { name: "Palak Paneer", calories: 185, protein: 10, carbs: 8, fat: 13, fiber: 2, sugar: 2, sodium: 500, servingSize: 100, servingUnit: "ml", category: "Dairy", emoji: "🍛" },
  { name: "Shahi Paneer", calories: 235, protein: 10, carbs: 10, fat: 18, fiber: 1.5, sugar: 4, sodium: 450, servingSize: 100, servingUnit: "ml", category: "Dairy", emoji: "🍛" },
  { name: "Paneer Tikka", calories: 220, protein: 16, carbs: 6, fat: 15, fiber: 1, sugar: 3, sodium: 400, servingSize: 100, servingUnit: "g", category: "Dairy", emoji: "🍢" },
  { name: "Matar Paneer", calories: 175, protein: 10, carbs: 12, fat: 10, fiber: 3, sugar: 3, sodium: 450, servingSize: 100, servingUnit: "ml", category: "Dairy", emoji: "🍛" },
  { name: "Kadai Paneer", calories: 200, protein: 11, carbs: 9, fat: 14, fiber: 2, sugar: 3, sodium: 480, servingSize: 100, servingUnit: "ml", category: "Dairy", emoji: "🍛" },
  { name: "Full-fat Milk", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.4, fiber: 0, sugar: 4.8, sodium: 44, servingSize: 100, servingUnit: "ml", category: "Dairy", emoji: "🥛" },
  { name: "Curd / Plain Yogurt", calories: 60, protein: 3.5, carbs: 4.7, fat: 2.5, fiber: 0, sugar: 4.7, sodium: 46, servingSize: 100, servingUnit: "g", category: "Dairy", emoji: "🥣" },
  { name: "Greek Yogurt", calories: 97, protein: 9, carbs: 3.6, fat: 5, fiber: 0, sugar: 3.2, sodium: 36, servingSize: 100, servingUnit: "g", category: "Dairy", emoji: "🥣" },
  { name: "Buttermilk (Chaas)", calories: 40, protein: 3.4, carbs: 4.8, fat: 1, fiber: 0, sugar: 4.8, sodium: 105, servingSize: 200, servingUnit: "ml", category: "Dairy", emoji: "🥛" },
  { name: "Skimmed Milk", calories: 34, protein: 3.4, carbs: 5, fat: 0.2, fiber: 0, sugar: 5, sodium: 44, servingSize: 100, servingUnit: "ml", category: "Dairy", emoji: "🥛" },
  { name: "Poha (flattened rice)", calories: 180, protein: 3.5, carbs: 32, fat: 4, fiber: 1.5, sugar: 1, sodium: 250, servingSize: 1, servingUnit: "plate (150g)", category: "Breakfast", emoji: "🍽️" },
  { name: "Upma", calories: 200, protein: 5, carbs: 30, fat: 7, fiber: 2, sugar: 1, sodium: 400, servingSize: 1, servingUnit: "plate (200g)", category: "Breakfast", emoji: "🍽️" },
  { name: "Idli (plain)", calories: 39, protein: 1.8, carbs: 8, fat: 0.3, fiber: 0.5, sugar: 0.5, sodium: 100, servingSize: 1, servingUnit: "piece (40g)", category: "Breakfast", emoji: "🟡" },
  { name: "Dosa (plain)", calories: 133, protein: 3.5, carbs: 24, fat: 2.5, fiber: 1, sugar: 0.5, sodium: 200, servingSize: 1, servingUnit: "piece (80g)", category: "Breakfast", emoji: "🌮" },
  { name: "Masala Dosa", calories: 230, protein: 5, carbs: 38, fat: 7, fiber: 2, sugar: 1.5, sodium: 380, servingSize: 1, servingUnit: "piece (160g)", category: "Breakfast", emoji: "🌮" },
  { name: "Oats (cooked)", calories: 71, protein: 2.5, carbs: 12, fat: 1.4, fiber: 1.7, sugar: 0, sodium: 49, servingSize: 100, servingUnit: "ml cooked", category: "Breakfast", emoji: "🥣" },
  { name: "Besan Chilla", calories: 145, protein: 8, carbs: 18, fat: 4, fiber: 3, sugar: 2, sodium: 250, servingSize: 1, servingUnit: "piece (80g)", category: "Breakfast", emoji: "🥘" },
  { name: "Aloo Sabzi", calories: 110, protein: 2, carbs: 20, fat: 3, fiber: 2, sugar: 1, sodium: 300, servingSize: 100, servingUnit: "g", category: "Vegetables", emoji: "🥘" },
  { name: "Bhindi Masala", calories: 80, protein: 2, carbs: 10, fat: 3.5, fiber: 4, sugar: 2, sodium: 280, servingSize: 100, servingUnit: "g", category: "Vegetables", emoji: "🌿" },
  { name: "Gobhi Sabzi", calories: 75, protein: 2.5, carbs: 10, fat: 3, fiber: 3, sugar: 2, sodium: 300, servingSize: 100, servingUnit: "g", category: "Vegetables", emoji: "🥦" },
  { name: "Mixed Vegetable Curry", calories: 90, protein: 3, carbs: 12, fat: 3.5, fiber: 3, sugar: 3, sodium: 350, servingSize: 100, servingUnit: "ml", category: "Vegetables", emoji: "🥘" },
  { name: "Palak Sabzi", calories: 55, protein: 3, carbs: 6, fat: 2.5, fiber: 3, sugar: 1, sodium: 300, servingSize: 100, servingUnit: "ml", category: "Vegetables", emoji: "🥬" },
  { name: "Baingan Bharta", calories: 80, protein: 2, carbs: 9, fat: 4, fiber: 3, sugar: 3, sodium: 300, servingSize: 100, servingUnit: "g", category: "Vegetables", emoji: "🍆" },
  { name: "Lauki Sabzi", calories: 45, protein: 1, carbs: 8, fat: 1.5, fiber: 2, sugar: 3, sodium: 200, servingSize: 100, servingUnit: "g", category: "Vegetables", emoji: "🥒" },
  { name: "Matar (Green Peas)", calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5, sugar: 5.5, sodium: 5, servingSize: 100, servingUnit: "g", category: "Vegetables", emoji: "🫛" },
  { name: "Tofu (firm)", calories: 76, protein: 8, carbs: 2, fat: 4.3, fiber: 0.3, sugar: 0.5, sodium: 9, servingSize: 100, servingUnit: "g", category: "Protein", emoji: "⬜" },
  { name: "Boiled Egg (whole)", calories: 78, protein: 6, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0.6, sodium: 62, servingSize: 1, servingUnit: "large egg", category: "Eggs", emoji: "🥚" },
  { name: "Egg White (boiled)", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, sugar: 0.2, sodium: 55, servingSize: 1, servingUnit: "egg white", category: "Eggs", emoji: "🥚" },
  { name: "Omelette (2 eggs)", calories: 185, protein: 12, carbs: 1, fat: 14, fiber: 0, sugar: 1, sodium: 180, servingSize: 1, servingUnit: "omelette", category: "Eggs", emoji: "🍳" },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, servingSize: 1, servingUnit: "medium (118g)", category: "Fruits", emoji: "🍌" },
  { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, servingSize: 1, servingUnit: "medium (182g)", category: "Fruits", emoji: "🍎" },
  { name: "Orange", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9, sodium: 0, servingSize: 1, servingUnit: "medium (131g)", category: "Fruits", emoji: "🍊" },
  { name: "Mango", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 13.7, sodium: 1, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "🥭" },
  { name: "Guava", calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, sugar: 8.9, sodium: 2, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "🍏" },
  { name: "Papaya", calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, sugar: 7.8, sodium: 8, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "🧡" },
  { name: "Watermelon", calories: 30, protein: 0.6, carbs: 7.5, fat: 0.2, fiber: 0.4, sugar: 6.2, sodium: 1, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "🍉" },
  { name: "Pomegranate", calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, sugar: 14, sodium: 3, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "❤️" },
  { name: "Grapes", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 15.5, sodium: 2, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "🍇" },
  { name: "Strawberries", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1, servingSize: 100, servingUnit: "g", category: "Fruits", emoji: "🍓" },
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 0, servingSize: 28, servingUnit: "g (~23 nuts)", category: "Nuts", emoji: "🌰" },
  { name: "Walnuts", calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sugar: 0.7, sodium: 1, servingSize: 28, servingUnit: "g (~14 halves)", category: "Nuts", emoji: "🪨" },
  { name: "Cashews", calories: 157, protein: 5.2, carbs: 9, fat: 12, fiber: 0.9, sugar: 1.7, sodium: 3, servingSize: 28, servingUnit: "g (~18 nuts)", category: "Nuts", emoji: "🌰" },
  { name: "Peanuts (roasted)", calories: 166, protein: 7.4, carbs: 6.1, fat: 14, fiber: 2.4, sugar: 1.1, sodium: 122, servingSize: 28, servingUnit: "g", category: "Nuts", emoji: "🥜" },
  { name: "Flaxseeds", calories: 55, protein: 1.9, carbs: 3, fat: 4.3, fiber: 2.8, sugar: 0.2, sodium: 3, servingSize: 14, servingUnit: "g (1 tbsp)", category: "Nuts", emoji: "🌱" },
  { name: "Chia Seeds", calories: 58, protein: 2, carbs: 5, fat: 3.7, fiber: 4.1, sugar: 0, sodium: 2, servingSize: 14, servingUnit: "g (1 tbsp)", category: "Nuts", emoji: "🌱" },
  { name: "Dates (Khajoor)", calories: 66, protein: 0.4, carbs: 18, fat: 0.1, fiber: 1.6, sugar: 16, sodium: 0, servingSize: 24, servingUnit: "g (2 dates)", category: "Nuts", emoji: "🫐" },
  { name: "Raisins (Kishmish)", calories: 85, protein: 0.9, carbs: 22, fat: 0.1, fiber: 1, sugar: 18, sodium: 3, servingSize: 28, servingUnit: "g", category: "Nuts", emoji: "🟤" },
  { name: "Whey Protein Shake", calories: 120, protein: 24, carbs: 4, fat: 1.5, fiber: 0, sugar: 2, sodium: 100, servingSize: 1, servingUnit: "scoop (30g)", category: "Protein", emoji: "💪" },
  { name: "Protein Bar", calories: 200, protein: 20, carbs: 22, fat: 7, fiber: 5, sugar: 8, sodium: 200, servingSize: 1, servingUnit: "bar (60g)", category: "Protein", emoji: "🍫" },
  { name: "Smoothie (Banana Milk)", calories: 200, protein: 8, carbs: 35, fat: 3, fiber: 2, sugar: 22, sodium: 80, servingSize: 300, servingUnit: "ml", category: "Drinks", emoji: "🥤" },
  { name: "Green Smoothie", calories: 150, protein: 5, carbs: 28, fat: 2, fiber: 4, sugar: 18, sodium: 60, servingSize: 300, servingUnit: "ml", category: "Drinks", emoji: "🥤" },
  { name: "Roasted Makhana", calories: 96, protein: 3.7, carbs: 20, fat: 0.5, fiber: 0.5, sugar: 0, sodium: 75, servingSize: 28, servingUnit: "g", category: "Snacks", emoji: "⚪" },
  { name: "Dhokla", calories: 110, protein: 5, carbs: 18, fat: 2, fiber: 1.5, sugar: 2, sodium: 400, servingSize: 2, servingUnit: "pieces (100g)", category: "Snacks", emoji: "🟡" },
  { name: "Chana Chaat", calories: 160, protein: 9, carbs: 25, fat: 2, fiber: 7, sugar: 3, sodium: 400, servingSize: 1, servingUnit: "bowl (150g)", category: "Snacks", emoji: "🫘" },
  { name: "Masala Chai (with milk)", calories: 80, protein: 2.5, carbs: 9, fat: 3, fiber: 0, sugar: 8, sodium: 50, servingSize: 200, servingUnit: "ml", category: "Drinks", emoji: "☕" },
  { name: "Black Coffee", calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5, servingSize: 240, servingUnit: "ml", category: "Drinks", emoji: "☕" },
  { name: "Coconut Water", calories: 46, protein: 1.7, carbs: 8.9, fat: 0.5, fiber: 2.6, sugar: 6, sodium: 252, servingSize: 240, servingUnit: "ml", category: "Drinks", emoji: "🥥" },
  { name: "Sweet Lassi", calories: 120, protein: 4, carbs: 18, fat: 3, fiber: 0, sugar: 15, sodium: 80, servingSize: 200, servingUnit: "ml", category: "Drinks", emoji: "🥤" },
];

// ─── Seeds ────────────────────────────────────────────────────────────────────────

const DEFAULT_HABITS: Omit<HabitDefinition, "id">[] = [
  { name: "Drink 2.5L Water", icon: "💧", color: "#93C5FD", targetDays: [0,1,2,3,4,5,6], isActive: true, createdAt: Date.now() },
  { name: "Workout / Exercise", icon: "🏋️", color: "#60A5FA", targetDays: [0,1,2,3,4,5,6], isActive: true, createdAt: Date.now() },
  { name: "Healthy Eating", icon: "🥗", color: "#34D399", targetDays: [0,1,2,3,4,5,6], isActive: true, createdAt: Date.now() },
  { name: "Journal / Manifest", icon: "✨", color: "#C8B6E2", targetDays: [0,1,2,3,4,5,6], isActive: true, createdAt: Date.now() },
  { name: "Meditation", icon: "🧘", color: "#A78BFA", targetDays: [0,1,2,3,4,5,6], isActive: true, createdAt: Date.now() },
  { name: "Sleep Before 11 PM", icon: "😴", color: "#818CF8", targetDays: [0,1,2,3,4,5,6], isActive: true, createdAt: Date.now() },
];

const DEFAULT_SETTINGS: Omit<Setting, "id">[] = [
  { key: "name", value: "Ripan" },
  { key: "age", value: "25" },
  { key: "height", value: "165" },
  { key: "currentWeight", value: "70" },
  { key: "goalWeight", value: "63" },
  { key: "calorieGoal", value: "1800" },
  { key: "proteinGoal", value: "100" },
  { key: "waterGoal", value: "2500" },
  { key: "stepGoal", value: "8000" },
];

export async function seedDatabase(): Promise<void> {
  try {
    const seeded = await db.settings.where("key").equals("seeded").first();
    if (seeded?.value === "true") return;
    const foodCount = await db.foods.count();
    if (foodCount === 0) await db.foods.bulkAdd(FOOD_DATABASE as FoodItem[]);
    const habitCount = await db.habitDefinitions.count();
    if (habitCount === 0) await db.habitDefinitions.bulkAdd(DEFAULT_HABITS as HabitDefinition[]);
    for (const setting of DEFAULT_SETTINGS) {
      const existing = await db.settings.where("key").equals(setting.key).first();
      if (!existing) await db.settings.add(setting as Setting);
    }
    const seededSetting = await db.settings.where("key").equals("seeded").first();
    if (seededSetting?.id) {
      await db.settings.update(seededSetting.id, { value: "true" });
    } else {
      await db.settings.add({ key: "seeded", value: "true" });
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}
