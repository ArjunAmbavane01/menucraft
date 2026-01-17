"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { WeeklyMenu } from "@/types/menu";
import { desc, eq } from "drizzle-orm";
import { startOfWeek, endOfWeek, parseISO, startOfDay } from "date-fns";
import { weekToISODate } from "@/lib/week-utils";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface MenusByPeriod {
  thisWeek: WeeklyMenu | null;
  upcoming: WeeklyMenu[];
  past: WeeklyMenu[];
}

/**
 * Get menus grouped by period: this week, upcoming, and past
 */
export async function getMenusByPeriod(): Promise<MenusByPeriod> {

  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession) redirect("/signin");

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
}