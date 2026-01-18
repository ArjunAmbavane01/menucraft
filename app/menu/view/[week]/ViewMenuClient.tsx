"use client";

import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { WeeklyMenu, MenuData } from "@/types/menu";
import { formatWeekDate } from "@/lib/week-utils";

interface ViewMenuClientProps {
    menu: WeeklyMenu;
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]>;
    lastUsedMap: Record<number, string | null>;
}

export default function ViewMenuClient({
    menu,
    dishesByCategory,
    lastUsedMap
}: ViewMenuClientProps) {
    const weekStartDate = formatWeekDate(new Date(menu.weekStartDate));
    const { meta, ...menuData } = menu.data;

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col gap-6 container mx-auto max-w-7xl px-6 py-16">
                <WeekHeader weekStartDate={weekStartDate} />

                <MenuTable
                    menu={{ id: menu.id, weekStartDate: menu.weekStartDate, data: menuData as MenuData, status: "published" }}
                    dishesByCategory={dishesByCategory}
                    lastUsedMap={lastUsedMap}
                    onDishChange={() => { }}
                    onToggleHoliday={() => { }}
                    readOnly
                />
            </div>
        </div>
    );
}

