"use server";

import { db } from "@/db";
import { dishes, dishUsage, weeklyMenus } from "@/db/schema";
import { MenuData, WeeklyMenu, MenuStatus } from "@/types/menu";
import { eq } from "drizzle-orm";
import { weekToISODate } from "@/lib/week-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractDishIds } from "@/lib/extractDishIds";

/**
 * Get all dishes grouped by category
 */
export async function getAllDishesByCategory() {
    const allDishes = await db.select().from(dishes);

    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {};

    for (const dish of allDishes) {
        if (!dishesByCategory[dish.category]) dishesByCategory[dish.category] = [];
        dishesByCategory[dish.category].push({
            id: dish.id,
            name: dish.name,
            category: dish.category,
        });
    }

    return dishesByCategory;
}

/**
 * Get menu by week (format: dd-mm-yyyy)
 */
export async function getMenuByWeek(week: string): Promise<WeeklyMenu | null> {
    const weekStartDate = weekToISODate(week);

    const [menu] = await db
        .select()
        .from(weeklyMenus)
        .where(eq(weeklyMenus.weekStartDate, weekStartDate))
        .limit(1);

    return (menu as WeeklyMenu) || null;
}

/**
 * Create menu for a week
 */
export async function createMenu(
    week: string,
    data: MenuData,
    status: MenuStatus = "draft"
): Promise<WeeklyMenu> {

    const userSession = await auth.api.getSession({
        headers: await headers(),
    });

    if (!userSession) redirect("/signin");

    const weekStartDate = weekToISODate(week);

    // Add status to data.meta
    const menuDataWithMeta: MenuData = {
        ...data,
        meta: { status },
    };

    // Check if menu already exists
    const existing = await getMenuByWeek(week);
    if (existing) {
        throw new Error("Menu already exists for this week");
    }

    const [createdMenu] = await db
        .insert(weeklyMenus)
        .values({
            weekStartDate,
            data: menuDataWithMeta,
            status, // Also store in column for easier queries
        })
        .returning();

    const dishIds = extractDishIds(menuDataWithMeta);

    if (dishIds.length > 0) {
        await db.insert(dishUsage).values(
            dishIds.map((id) => ({
                dishId: id,
                weekStartDate,
            }))
        );
    }

    revalidatePath("/dashboard");
    revalidatePath(`/menu/create/${week}`);
    revalidatePath(`/menu/edit/${week}`);
    revalidatePath(`/menu/view/${week}`);

    return createdMenu as WeeklyMenu;
}

/**
 * Update menu for a week
 */
export async function updateMenu(
    week: string,
    data: MenuData,
    status: MenuStatus = "draft"
): Promise<WeeklyMenu> {

    const userSession = await auth.api.getSession({
        headers: await headers(),
    });

    if (!userSession) redirect("/signin");

    const weekStartDate = weekToISODate(week);

    // Add status to data.meta
    const menuDataWithMeta: MenuData = {
        ...data,
        meta: { status },
    };

    const [updatedMenu] = await db
        .update(weeklyMenus)
        .set({
            data: menuDataWithMeta,
            status, // Also update column
        })
        .where(eq(weeklyMenus.weekStartDate, weekStartDate))
        .returning();

    if (!updatedMenu) throw new Error("Menu not found");

    await db.delete(dishUsage).where(eq(dishUsage.weekStartDate, weekStartDate));

    const dishIds = extractDishIds(menuDataWithMeta);

    if (dishIds.length > 0) {
        await db.insert(dishUsage).values(
            dishIds.map((id) => ({
                dishId: id,
                weekStartDate,
            }))
        );
    }

    revalidatePath("/dashboard");
    revalidatePath(`/menu/create/${week}`);
    revalidatePath(`/menu/edit/${week}`);
    revalidatePath(`/menu/view/${week}`);

    return updatedMenu as WeeklyMenu;
}

