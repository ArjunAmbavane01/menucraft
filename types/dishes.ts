export type DishCategory =
  | "main"
  | "side"
  | "egg"
  | "pulav"
  | "dal"
  | "chicken"
  | "special"
  | "dalkhichdi"
  | "snacks";

export interface Dish {
  id: number;
  name: string;
  category: DishCategory;
}

export type DishesByCategory = Record<string, Dish[]>;
export type LastUsedMap = Record<number, string | null>;
