"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { WeeklyMenu } from "@/types/menu";
import { desc, eq } from "drizzle-orm";
import { startOfWeek, endOfWeek, parseISO, startOfDay } from "date-fns";
import { unstable_cache } from "next/cache";

export interface MenusByPeriod {
  thisWeek: WeeklyMenu | null;
  upcoming: WeeklyMenu[];
  past: WeeklyMenu[];
}

/**
 * Get menus grouped by period: this week, upcoming, and past
 */
export const getMenusByPeriod = unstable_cache(
  async (): Promise<MenusByPeriod> => {
    const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const allMenus = await db
      .select()
      .from(weeklyMenus)
      .orderBy(desc(weeklyMenus.weekStartDate));

    const result: MenusByPeriod = {
      thisWeek: null,
      upcoming: [],
      past: [],
    };

    for (const menu of allMenus) {
      const menuDate = startOfDay(parseISO(menu.weekStartDate as string));
      const weekStart = startOfDay(thisWeekStart);
      const weekEnd = startOfDay(thisWeekEnd);

      if (menuDate >= weekStart && menuDate <= weekEnd) {
        result.thisWeek = menu as WeeklyMenu;
      } else if (menuDate > weekEnd) {
        result.upcoming.push(menu as WeeklyMenu);
      } else {
        result.past.push(menu as WeeklyMenu);
      }
    }

    return result;
  },
  ['menus-by-period'],
  {
    revalidate: 86400, // 24 hours
    tags: ['menus']
  }
);