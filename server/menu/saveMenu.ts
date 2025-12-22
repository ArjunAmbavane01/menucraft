"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WeeklyMenu, Weekday, MenuTemplate } from "@/types/menu";

export async function saveMenu(menu: WeeklyMenu) {
  const missing: string[] = [];

  for (const day of Object.keys(MenuTemplate) as Weekday[]) {
    for (const category of MenuTemplate[day]) {
      const dishId = menu.data[day]?.[category];
      if (!dishId) {
        missing.push(`${day} → ${category}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `The following slots are empty:\n${missing.join("\n")}`
    );
  }

  const [row] = await db
    .update(weeklyMenus)
    .set({ data: menu.data, weekStartDate: menu.weekStartDate })
    .where(eq(weeklyMenus.id, menu.id))
    .returning();

  return row.id;
}
