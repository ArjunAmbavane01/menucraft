import { notFound } from "next/navigation";
import { getMenuByWeek, getAllDishesByCategory } from "@/server/menu/menuActions";
import { parseWeekDate, weekToISODate } from "@/lib/week-utils";
import ViewMenuClient from "./ViewMenuClient";
import { getDishLastUsedMap } from "@/server/menu/getDishLastUsedMap";

interface PageProps {
    params: Promise<{ week: string }>;
}

export default async function ViewMenuPage({ params }: PageProps) {
    const { week } = await params;

    try {
        parseWeekDate(week);
    } catch {
        notFound();
    }

    // Get menu
    const menu = await getMenuByWeek(week);
    if (!menu) notFound();

    // Only show published menus in public view
    const status = menu.status;
    if (status !== "published") notFound();

    // Fetch dishes and last used map
    const dishesByCategory = await getAllDishesByCategory();
    const lastUsedMap = await getDishLastUsedMap(weekToISODate(week));

    return (
        <ViewMenuClient
            menu={menu}
            dishesByCategory={dishesByCategory}
            lastUsedMap={lastUsedMap}
        />
    );
}

