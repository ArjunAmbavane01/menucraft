export type DishCategory =
  | "main"
  | "side"
  | "egg"
  | "pulav"
  | "dal-khichdi"
  | "chicken"
  | "optional";

export interface Dish {
  id: number;
  name: string;
  category: DishCategory;
}
