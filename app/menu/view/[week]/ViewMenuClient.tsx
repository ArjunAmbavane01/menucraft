"use client";

import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { WeeklyMenu, MenuData } from "@/types/menu";
import { formatWeekDate, parseWeekDate } from "@/lib/week-utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ViewMenuClientProps {
    menu: WeeklyMenu;
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]>;
    lastUsedMap: Record<number, string | null>;
}

export default function ViewMenuClient({
    menu,
    dishesByCategory: rawDishesByCategory,
    lastUsedMap,
}: ViewMenuClientProps) {

    const router = useRouter();

    const weekStartDate = formatWeekDate(new Date(menu.weekStartDate));

    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {} as any;
    for (const [category, dishes] of Object.entries(rawDishesByCategory)) {
        dishesByCategory[category] = dishes;
    }

    const menuData = { ...menu.data };
    if (menuData.meta) delete (menuData as any).meta;

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col gap-6 container mx-auto max-w-7xl px-6 py-16">
                <WeekHeader weekStartDate={weekStartDate} />

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

