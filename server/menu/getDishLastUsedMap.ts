"use server";

import { db } from "@/db";
import { dishUsage } from "@/db/schema";
import { parseISODate } from "@/lib/week-utils";
import { differenceInCalendarWeeks, startOfWeek } from "date-fns";
import { max } from "drizzle-orm";

/**
 * Computes when each dish was last used in any previous menu.
 * Returns a map: dishId -> string | null
 * String format: "2 weeks ago" or "this week"
 * null if never used
 *
 * @param weekStartDate - ISO date string (YYYY-MM-DD) from database
 */
export const getDishLastUsedMap = async (weekStartDate: string) => {
  const rows = await db
    .select({
      dishId: dishUsage.dishId,
      lastUsed: max(dishUsage.weekStartDate),
    })
    .from(dishUsage)
    .groupBy(dishUsage.dishId);

  const thisWeekStart = startOfWeek(parseISODate(weekStartDate), { weekStartsOn: 1 });
  const result: Record<number, string> = {};

  for (const row of rows) {
    if (!row.lastUsed) continue;

    const lastUsedDate = parseISODate(row.lastUsed);
    const weeksAgo = differenceInCalendarWeeks(thisWeekStart, lastUsedDate);

    if (weeksAgo === 0) result[row.dishId] = "this week";
    else if (weeksAgo > 0) result[row.dishId] = `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
    else {
      const w = Math.abs(weeksAgo);
      result[row.dishId] = `in ${w} week${w > 1 ? "s" : ""}`;
    }
  }

  return result;
}