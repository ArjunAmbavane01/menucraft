import { notFound } from "next/navigation";
import { getMenuByWeek, getAllDishesByCategory } from "@/server/menu/menuActions";
import { parseWeekDate } from "@/lib/week-utils";
import ViewMenuClient from "./ViewMenuClient";

interface PageProps {
    params: Promise<{ week: string }>;
}

export default async function ViewMenuPage({ params }: PageProps) {
    const { week } = await params;

    // Validate week format
    try {
        parseWeekDate(week);
    } catch {
        notFound();
    }

    // Get menu
    const menu = await getMenuByWeek(week);
    if (!menu) {
        notFound();
    }

    // Only show published menus in public view
    const status = menu.data.meta?.status || menu.status;
    if (status !== "published") {
        notFound();
    }

    // Fetch dishes
    const dishesByCategoryRaw = await getAllDishesByCategory();

    // Convert to Dish[] format for each category
    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {};
    for (const [category, dishes] of Object.entries(dishesByCategoryRaw)) {
        dishesByCategory[category] = dishes;
    }

    return (
        <ViewMenuClient
            menu={menu}
            dishesByCategory={dishesByCategory}
        />
    );
}

