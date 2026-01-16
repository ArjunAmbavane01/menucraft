"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { MenuData, Weekday } from "@/types/menu";
import { parseISO, compareDesc, differenceInWeeks, startOfWeek } from "date-fns";

/**
 * Computes when each dish was last used in any previous menu.
 * Returns a map: dishId -> string | null
 * String format: "2 weeks ago" or "this week"
 * null if never used
 */
export async function getDishLastUsedMap(): Promise<Record<number, string | null>> {
  const allMenus = await db
    .select({
      weekStartDate: weeklyMenus.weekStartDate,
      data: weeklyMenus.data,
    })
    .from(weeklyMenus);

  const dishLastUsed: Record<number, Date | null> = {};
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Process all menus to find the most recent usage of each dish
  for (const menu of allMenus) {
    const weekStartDate = parseISO(menu.weekStartDate as string);
    const menuData = menu.data as MenuData;

    // Scan each day in the menu (skip meta if exists)
    const weekdays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    for (const day of weekdays) {
      const dayData = menuData[day];

      if (!dayData || dayData.isHoliday) continue;

      // Check each dish in this day
      if (dayData.dishes) {
        for (const dishId of Object.values(dayData.dishes)) {
          if (!dishId) continue;

          const existingDate = dishLastUsed[dishId];

          // Update if this menu is more recent
          if (!existingDate || compareDesc(weekStartDate, existingDate) > 0) {
            dishLastUsed[dishId] = weekStartDate;
          }
        }
      }
    }
  }

  // Convert dates to "X weeks ago" format
  const result: Record<number, string | null> = {};
  for (const [dishId, date] of Object.entries(dishLastUsed)) {
    if (!date) {
      result[Number(dishId)] = null;
    } else {
      const weeksAgo = differenceInWeeks(thisWeekStart, date);
      result[Number(dishId)] = weeksAgo === 0 ? "this week" : `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
    }
  }

  return result;
}
