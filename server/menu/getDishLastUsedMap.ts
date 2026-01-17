"use server";

import { db } from "@/db";
import { dishUsage } from "@/db/schema";
import { differenceInWeeks, startOfWeek } from "date-fns";
import { max } from "drizzle-orm";
import { unstable_cache } from 'next/cache';

/**
 * Computes when each dish was last used in any previous menu.
 * Returns a map: dishId -> string | null
 * String format: "2 weeks ago" or "this week"
 * null if never used
 */
export async function getDishLastUsedMap(weekStartDate: Date) {
  return unstable_cache(
    async () => {
      const rows = await db
        .select({
          dishId: dishUsage.dishId,
          lastUsed: max(dishUsage.weekStartDate),
        })
        .from(dishUsage)
        .groupBy(dishUsage.dishId);

      const thisWeekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
      const result: Record<number, string> = {};

      for (const row of rows) {
        const date = new Date(row.lastUsed!);
        const weeksAgo = differenceInWeeks(thisWeekStart, date);

        if (weeksAgo === 0) result[row.dishId] = "this week";
        else if (weeksAgo > 0) result[row.dishId] = `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
        else {
          const w = Math.abs(weeksAgo);
          result[row.dishId] = `in ${w} week${w > 1 ? "s" : ""}`;
        }
      }

      return result;
    },
    [`dish-last-used-${weekStartDate.toISOString()}`],
    {
      revalidate: 86400,
      tags: ["dish-usage"],
    }
  )();
}

