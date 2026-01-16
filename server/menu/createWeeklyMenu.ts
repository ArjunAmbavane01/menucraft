"use server";

import { db } from "@/db";
import { dishes, weeklyMenus } from "@/db/schema";
import { MenuTemplate, WeeklyMenu, Weekday } from "@/types/menu";
import { eq } from "drizzle-orm";
import { getWeekStart, formatWeekDate, weekToISODate } from "@/lib/week-utils";

function pickRandom(arr: number[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function createWeeklyMenu(): Promise<{
  menu: WeeklyMenu;
  dishesByCategory: Record<string, { id: number; name: string }[]>;
}> {
  // Get current week's Monday and convert to YYYY-MM-DD for database
  const weekStart = getWeekStart();
  const weekFormat = formatWeekDate(weekStart);
  const weekStartDate = weekToISODate(weekFormat);

  // Check if menu already exists for this week
  const existingMenu = await db
    .select()
    .from(weeklyMenus)
    .where(eq(weeklyMenus.weekStartDate, weekStartDate))
    .limit(1);

  const all = await db.select().from(dishes);

  const dishesByCategory: Record<string, { id: number; name: string }[]> = {};
  const groupedIds: Record<string, number[]> = {};

  for (const d of all) {
    if (!groupedIds[d.category]) groupedIds[d.category] = [];
    groupedIds[d.category].push(d.id);

    if (!dishesByCategory[d.category]) dishesByCategory[d.category] = [];
    dishesByCategory[d.category].push({ id: d.id, name: d.name });
  }

  // If menu exists, return it
  if (existingMenu.length > 0) {
    return {
      menu: existingMenu[0] as WeeklyMenu,
      dishesByCategory,
    };
  }

  // Otherwise create new menu
  const data: WeeklyMenu["data"] = {
    monday: {
      isHoliday: false,
      dishes: {}
    },
    tuesday: {
      isHoliday: false,
      dishes: {}
    },
    wednesday: {
      isHoliday: false,
      dishes: {}
    },
    thursday: {
      isHoliday: false,
      dishes: {}
    },
    friday: {
      isHoliday: false,
      dishes: {}
    },
  };

  for (const day of Object.keys(MenuTemplate) as Weekday[]) {
    const categoriesForDay = MenuTemplate[day];

    for (const category of categoriesForDay) {
      const ids = groupedIds[category] ?? [];
      if (!ids.length) continue;
      const random = pickRandom(ids);

      data[day] = {
        ...data[day],
        dishes: {
          ...data[day].dishes,
          [category]: random,
        },
      };
    }
  }

  const [createdMenu] = await db
    .insert(weeklyMenus)
    .values({ weekStartDate, data, status: "draft" })
    .returning();

  return {
    menu: createdMenu as WeeklyMenu,
    dishesByCategory,
  };
}
