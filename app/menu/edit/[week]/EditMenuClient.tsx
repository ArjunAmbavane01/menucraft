"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { updateMenu } from "@/server/menu/menuActions";
import { MenuData, Weekday, WeeklyMenu, MenuStatus } from "@/types/menu";
import { weekToISODate } from "@/lib/week-utils";
import { isMenuComplete } from "@/lib/menu-validation";
import { Save, Globe } from "lucide-react";
import { DishCategory } from "@/types/dishes";

interface EditMenuClientProps {
    week: string;
    menu: WeeklyMenu;
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]>;
    lastUsedMap: Record<number, string | null>;
    user: any;
}

export default function EditMenuClient({
    week,
    menu: initialMenu,
    dishesByCategory: rawDishesByCategory,
    lastUsedMap,
    user,
}: EditMenuClientProps) {
    const router = useRouter();
    // week is in dd-mm-yyyy format from URL
    // WeekHeader expects week format (dd-mm-yyyy), MenuTable expects YYYY-MM-DD
    const weekStartDate = weekToISODate(week);

    // Convert to proper format
    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {};
    for (const [category, dishes] of Object.entries(rawDishesByCategory)) {
        dishesByCategory[category] = dishes;
    }

    // Extract menu data, removing meta if it exists
    const initialData = { ...initialMenu.data };
    if (initialData.meta) {
        delete (initialData as any).meta;
    }

    const [menuData, setMenuData] = useState<MenuData>(initialData as MenuData);
    const [saving, setSaving] = useState(false);

    const handleDishChange = (day: Weekday, category: DishCategory, dishId: number) => {
        setMenuData((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                dishes: {
                    ...prev[day].dishes,
                    [category]: dishId,
                },
            },
        }));
    };

    const handleToggleHoliday = (day: Weekday) => {
        setMenuData((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                isHoliday: !prev[day].isHoliday,
            },
        }));
    };

    const handleSave = async (status: MenuStatus) => {
        setSaving(true);
        try {
            await updateMenu(week, menuData, status);
            toast.success(status === "published" ? "Menu published" : "Draft saved");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to save menu");
        } finally {
            setSaving(false);
        }
    };

    const canPublish = isMenuComplete(menuData);
    const currentStatus = initialMenu.data.meta?.status || initialMenu.status;

    return (
        <div className="container mx-auto max-w-7xl px-6 py-8 pt-24">
            <div className="mb-8">
                <WeekHeader weekStartDate={week} status={currentStatus} showStatus />
            </div>

            <MenuTable
                menu={{ id: initialMenu.id, weekStartDate, data: menuData, status: currentStatus }}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                onDishChange={handleDishChange}
                onToggleHoliday={handleToggleHoliday}
            />

            <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleSave("draft")}
                    disabled={saving}
                >
                    <Save className="mr-2 size-4" />
                    Save Draft
                </Button>
                <Button
                    onClick={() => handleSave("published")}
                    disabled={saving || !canPublish}
                >
                    <Globe className="mr-2 size-4" />
                    Publish
                </Button>
            </div>

            {!canPublish && (
                <p className="mt-4 text-sm text-muted-foreground text-right">
                    Complete all required slots to publish
                </p>
            )}
        </div>
    );
}

