"use server";

import { db } from "@/db";
import { dishes, weeklyMenus } from "@/db/schema";
import { MenuTemplate, WeeklyMenu, Weekday, MenuStatus } from "@/types/menu";
import { eq } from "drizzle-orm";
import { weekToISODate } from "@/lib/week-utils";
import { revalidatePath } from "next/cache";

/**
 * Create an empty menu for a specific week (format: dd-mm-yyyy)
 * Returns the menu and dishes grouped by category
 */
export async function createMenuForWeek(weekFormat: string): Promise<{
  menu: WeeklyMenu;
  dishesByCategory: Record<string, { id: number; name: string }[]>;
}> {
  const weekStartDate = weekToISODate(weekFormat);

  // Check if menu already exists for this week
  const existingMenu = await db
    .select()
    .from(weeklyMenus)
    .where(eq(weeklyMenus.weekStartDate, weekStartDate))
    .limit(1);

  const all = await db.select().from(dishes);

  const dishesByCategory: Record<string, { id: number; name: string }[]> = {};

  for (const d of all) {
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

  // Otherwise create new empty menu
  const data: WeeklyMenu["data"] = {
    monday: {
      isHoliday: false,
      dishes: {},
    },
    tuesday: {
      isHoliday: false,
      dishes: {},
    },
    wednesday: {
      isHoliday: false,
      dishes: {},
    },
    thursday: {
      isHoliday: false,
      dishes: {},
    },
    friday: {
      isHoliday: false,
      dishes: {},
    },
  };

  const [createdMenu] = await db
    .insert(weeklyMenus)
    .values({ weekStartDate, data, status: "draft" })
    .returning();

  revalidatePath("/dashboard");

  return {
    menu: createdMenu as WeeklyMenu,
    dishesByCategory,
  };
}

/**
 * Publish a menu (change status to published)
 */
export async function publishMenu(menuId: number): Promise<void> {
  await db
    .update(weeklyMenus)
    .set({ status: "published" })
    .where(eq(weeklyMenus.id, menuId));

  revalidatePath("/dashboard");
}

