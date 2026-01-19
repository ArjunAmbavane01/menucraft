"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { WeeklyMenu } from "@/types/menu";
import { desc } from "drizzle-orm";
import { startOfWeek, endOfWeek, parseISO, startOfDay, addDays } from "date-fns";
import { getWeekStart, parseISODate } from "@/lib/week-utils";

export interface MenusByPeriod {
  thisWeek: WeeklyMenu | null;
  upcoming: WeeklyMenu[];
  past: WeeklyMenu[];
}

/**
 * Get menus grouped by period: this week, upcoming, and past
 */
export const getMenusByPeriod = async (): Promise<MenusByPeriod> => {
  const thisWeekStart = getWeekStart();
  const thisWeekEnd = addDays(thisWeekStart, 6); // consider till sunday for current week menu

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
    const menuDate = parseISODate(menu.weekStartDate);

    if (menuDate >= thisWeekStart && menuDate <= thisWeekEnd) {
      result.thisWeek = menu as WeeklyMenu;
    } else if (menuDate > thisWeekEnd) {
      result.upcoming.push(menu as WeeklyMenu);
    } else {
      result.past.push(menu as WeeklyMenu);
    }
  }

  return result;
}
