"use server";

import { db } from "@/db";
import { weeklyMenus } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteMenu(menuId: number) {
  const result = await db
    .delete(weeklyMenus)
    .where(eq(weeklyMenus.id, menuId))
    .returning();

  if (result.length === 0) throw new Error("Menu not found or already deleted.");
  return true;
}
