export type DishCategory =
  | "main"
  | "side"
  | "egg"
  | "pulav"
  | "dal"
  | "chicken"
  | "special"
  | "snack";

export interface Dish {
  id: number;
  name: string;
  category: DishCategory;
}
