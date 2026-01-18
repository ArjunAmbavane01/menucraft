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
  eveningSnacks: number[];
};

export type MenuData = Record<Weekday, MenuDay> & {
  meta?: {
    status: MenuStatus;
  };
};

export type MenuStatus = "draft" | "published";

export interface WeeklyMenu {
  id: number;
  weekStartDate: string;
  data: MenuData;
  status: MenuStatus;
}

export const MenuTemplate: Record<Weekday, DishCategory[]> = {
  monday: ["main", "side", "egg", "dal", "special", "pulav"],
  tuesday: ["main", "side", "egg", "dal", "special", "pulav"],
  wednesday: ["main", "side", "egg", "dal", "special", "pulav", "chicken"],
  thursday: ["main", "side", "egg", "dal", "special", "pulav"],
  friday: ["main", "side", "egg", "dal", "special", "pulav", "chicken"],
};