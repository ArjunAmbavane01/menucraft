"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WeeklyMenu, Weekday, MenuTemplate } from "@/types/menu";
import { revalidatePath } from "next/cache";

export async function saveMenu(menu: WeeklyMenu) {
  const missing: string[] = [];

  for (const day of Object.keys(MenuTemplate) as Weekday[]) {
    const dayData = menu.data[day];

    if (dayData?.isHoliday) continue;

    const categoriesForDay = MenuTemplate[day];

    for (const category of categoriesForDay) {
      const dishId = dayData?.dishes?.[category];
      if (!dishId) missing.push(`${day} → ${category}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `The following slots are empty:\n${missing.join("\n")}`
    );
  }

  const [row] = await db
    .update(weeklyMenus)
    .set({ data: menu.data, weekStartDate: menu.weekStartDate, status: menu.status })
    .where(eq(weeklyMenus.id, menu.id))
    .returning();

  revalidatePath('/dashboard')
  return row.id;
}
