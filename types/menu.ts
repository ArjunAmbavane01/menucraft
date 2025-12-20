import { DishCategory } from "./dishes";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type MenuData = Record<
  Weekday,
  Partial<Record<DishCategory, number>> // dish id reference
>;

export interface WeeklyMenu {
  id: number;
  weekStartDate: string; 
  data: MenuData;
}
