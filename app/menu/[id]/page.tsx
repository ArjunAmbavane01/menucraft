import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { weeklyMenus, dishes } from "@/db/schema";
import { eq } from "drizzle-orm";
import MenuViewPage from "@/components/menu-view/MenuViewPage";
import { DishCategory } from "@/types/dishes";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/signin");

    const menuId = Number(id);

    console.log(menuId)
    console.log(typeof menuId)
    const [menu] = await db
        .select()
        .from(weeklyMenus)
        .where(eq(weeklyMenus.id, menuId));

    if (!menu) redirect("/dashboard");

    const rawDishes = await db.select().from(dishes);
    const allDishes = rawDishes.map((d) => ({
        id: d.id,
        name: d.name,
        category: d.category as DishCategory,
    }));

    return (
        <MenuViewPage
            menu={menu}
            allDishes={allDishes}
        />
    );
}
