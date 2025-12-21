"use server";

import { db } from "@/db";
import { dishes, weeklyMenus } from "@/db/schema";
import { MenuTemplate, WeeklyMenu, Weekday } from "@/types/menu";

function pickRandom(arr: number[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function createWeeklyMenu(): Promise<{
  menu: WeeklyMenu;
  dishesByCategory: Record<string, { id: number; name: string }[]>;
}> {
  const all = await db.select().from(dishes);

  const dishesByCategory: Record<string, { id: number; name: string }[]> = {};
  const groupedIds: Record<string, number[]> = {};

  for (const d of all) {
    if (!groupedIds[d.category]) groupedIds[d.category] = [];
    groupedIds[d.category].push(d.id);

    if (!dishesByCategory[d.category]) dishesByCategory[d.category] = [];
    dishesByCategory[d.category].push({ id: d.id, name: d.name });
  }

  const data: WeeklyMenu["data"] = {
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
  };

  for (const day of Object.keys(MenuTemplate) as Weekday[]) {
    for (const category of MenuTemplate[day]) {
      const ids = groupedIds[category] ?? [];
      if (!ids.length) continue;
      const random = pickRandom(ids);

      data[day] = {
        ...data[day],
        [category]: random,
      };
    }
  }

  const weekStartDate = new Date().toISOString().split("T")[0];

  const [row] = await db
    .insert(weeklyMenus)
    .values({ weekStartDate, data })
    .returning();

  return {
    menu: row as WeeklyMenu,
    dishesByCategory,
  };
}
