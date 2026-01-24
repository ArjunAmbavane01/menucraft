import { DishCategory } from "./dishes";

export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export type Weekday = (typeof weekdays)[number];

export const weekdayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export type MenuStatus = "draft" | "published";

export type DailyMenu = {
  isHoliday: boolean;
  dishes: Partial<Record<DishCategory, number>>;
  eveningSnacks: number[];
};

export type MenuData = Record<Weekday, DailyMenu>;

export interface WeeklyMenu {
  id: number;
  weekStartDate: string;
  data: MenuData;
  status: MenuStatus;
}

export const MenuTemplate: Record<Weekday, DishCategory[]> = {
  monday: ["main", "side", "egg", "dal", "rice", "dal khichdi", "special", "chicken", "snack"],
  tuesday: ["main", "side", "egg", "dal", "rice", "dal khichdi", "special", "chicken", "snack"],
  wednesday: ["main", "side", "egg", "dal", "rice", "dal khichdi", "special", "chicken", "snack"],
  thursday: ["main", "side", "egg", "dal", "rice", "dal khichdi", "special", "chicken", "snack"],
  friday: ["main", "side", "egg", "dal", "rice", "dal khichdi", "special", "chicken", "snack"],
};