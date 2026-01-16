"use client";

import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { WeeklyMenu, MenuData } from "@/types/menu";
import { formatWeekDate, parseWeekDate } from "@/lib/week-utils";

interface ViewMenuClientProps {
    menu: WeeklyMenu;
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]>;
}

export default function ViewMenuClient({
    menu,
    dishesByCategory: rawDishesByCategory,
}: ViewMenuClientProps) {
    // menu.weekStartDate is stored as YYYY-MM-DD in database, convert to week format (dd-mm-yyyy) for WeekHeader
    const weekStartDate = formatWeekDate(new Date(menu.weekStartDate));

    // Convert to proper format
    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {} as any;
    for (const [category, dishes] of Object.entries(rawDishesByCategory)) {
        dishesByCategory[category] = dishes;
    }

    // Extract menu data, removing meta if it exists
    const menuData = { ...menu.data };
    if (menuData.meta) {
        delete (menuData as any).meta;
    }

    // Empty lastUsedMap for read-only view (not needed)
    const lastUsedMap: Record<number, string | null> = {};

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-7xl px-6 py-16">
                <div className="mb-8">
                    <WeekHeader weekStartDate={weekStartDate} />
                </div>

                <MenuTable
                    menu={{ id: menu.id, weekStartDate: menu.weekStartDate, data: menuData as MenuData, status: "published" }}
                    dishesByCategory={dishesByCategory as any}
                    lastUsedMap={lastUsedMap}
                    onDishChange={() => { }}
                    onToggleHoliday={() => { }}
                    readOnly
                />
            </div>
        </div>
    );
}

