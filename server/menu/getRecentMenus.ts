"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { WeeklyMenu } from "@/types/menu";
import { desc } from "drizzle-orm";

export async function getRecentMenus() {
    const rows = await db
        .select()
        .from(weeklyMenus)
        .orderBy(desc(weeklyMenus.weekStartDate));

    return rows as WeeklyMenu[];
}
