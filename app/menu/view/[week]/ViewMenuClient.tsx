"use client";

import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { WeeklyMenu, MenuData } from "@/types/menu";
import { formatWeekDate } from "@/lib/week-utils";
import { DishesByCategory, LastUsedMap } from "@/types/dishes";

interface ViewMenuClientProps {
    menu: WeeklyMenu;
    dishesByCategory: DishesByCategory;
    lastUsedMap: LastUsedMap;
}

export default function ViewMenuClient({
    menu,
    dishesByCategory,
    lastUsedMap
}: ViewMenuClientProps) {
    const weekStartDate = formatWeekDate(new Date(menu.weekStartDate));

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col gap-6 container mx-auto max-w-7xl px-6 py-16">
                <WeekHeader weekStartDate={weekStartDate} />
                <MenuTable
                    menu={{ id: menu.id, weekStartDate: menu.weekStartDate, data: menu.data, status: "published" }}
                    dishesByCategory={dishesByCategory}
                    lastUsedMap={lastUsedMap}
                    onDishChange={() => { }}
                    onSnacksChange={() => { }}
                    onToggleHoliday={() => { }}
                    readOnly
                />
            </div>
        </div>
    );
}

