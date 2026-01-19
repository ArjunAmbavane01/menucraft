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
