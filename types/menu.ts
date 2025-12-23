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

export type MenuDay = {
  isHoliday: boolean;
  dishes: Partial<Record<DishCategory, number>>;
};

export type MenuData = Record<Weekday, MenuDay>;

export interface WeeklyMenu {
  id: number;
  weekStartDate: string;
  data: MenuData;
}

export const MenuTemplate: Record<Weekday, DishCategory[]> = {
  monday: ["main", "side", "egg", "dal", "optional", "pulav"],
  tuesday: ["main", "side", "egg", "dal", "optional", "pulav"],
  wednesday: ["main", "side", "egg", "dal", "optional", "pulav", "chicken"],
  thursday: ["main", "side", "egg", "dal", "optional", "pulav"],
  friday: ["main", "side", "egg", "dal", "optional", "pulav", "chicken"],
};