export type DishCategory =
  | "main"
  | "side"
  | "egg"
  | "rice"
  | "dal"
  | "chicken"
  | "special"
  | "dal khichdi"
  | "snack";

export interface Dish {
  id: number;
  name: string;
  category: DishCategory;
}

export type DishesByCategory = Record<string, Dish[]>;
export type LastUsedMap = Record<number, string | null>;

export const ALL_CATEGORIES = [
  "main",
  "side",
  "egg",
  "rice",
  "dal",
  "chicken",
  "special",
  "dal khichdi",
  "snack",
] as const satisfies readonly DishCategory[];
