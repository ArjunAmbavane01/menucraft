import { DishCategory } from "./dishes";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export const weekdays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export type MenuData = Record<
  Weekday,
  Partial<Record<DishCategory, number>> // dish id reference
>;

export interface WeeklyMenu {
  id: number;
  weekStartDate: string;
  data: MenuData;
}

export const MenuTemplate: Record<Weekday, DishCategory[]> = {
  monday: ["main", "side", "egg", "pulav"],
  tuesday: ["main", "side", "egg", "pulav"],
  wednesday: ["main", "side", "egg", "pulav", "chicken"],
  thursday: ["main", "side", "egg", "pulav"],
  friday: ["main", "side", "egg", "pulav", "chicken"],
};