"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { createMenu } from "@/server/menu/menuActions";
import { MenuData, Weekday, MenuStatus } from "@/types/menu";
import { weekToISODate } from "@/lib/week-utils";
import { isMenuComplete } from "@/lib/menu-validation";
import { Save, Globe } from "lucide-react";
import { DishCategory } from "@/types/dishes";
import { Spinner } from "@/components/ui/spinner";

interface CreateMenuClientProps {
    week: string;
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]>;
    lastUsedMap: Record<number, string | null>;
    user: any;
}

export default function CreateMenuClient({
    week,
    dishesByCategory: rawDishesByCategory,
    lastUsedMap,
    user,
}: CreateMenuClientProps) {
    const router = useRouter();
    const weekStartDate = weekToISODate(week);

    const [savingDraft, setSavingDraft] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<MenuStatus>("draft");
    const [hasEverSaved, setHasEverSaved] = useState(false);

    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {};
    for (const [category, dishes] of Object.entries(rawDishesByCategory)) {
        dishesByCategory[category] = dishes;
    }

    const [menuData, setMenuData] = useState<MenuData>({
        monday: { isHoliday: false, dishes: {} },
        tuesday: { isHoliday: false, dishes: {} },
        wednesday: { isHoliday: false, dishes: {} },
        thursday: { isHoliday: false, dishes: {} },
        friday: { isHoliday: false, dishes: {} },
    });

    const handleDishChange = (day: Weekday, category: DishCategory, dishId: number) => {
        setHasUnsavedChanges(true);
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
        setHasUnsavedChanges(true);
        setMenuData((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                isHoliday: !prev[day].isHoliday,
            },
        }));
    };

    const handleSave = async (status: MenuStatus) => {
        status === "draft" ? setSavingDraft(true) : setPublishing(true);
        try {
            await createMenu(week, menuData, status);
            toast.success(status === "published" ? "Menu published" : "Draft saved");
            setHasUnsavedChanges(false);
            setCurrentStatus(status);
            setHasEverSaved(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to save menu");
        } finally {
            status === "draft" ? setSavingDraft(false) : setPublishing(false);
        }
    };

    const canPublish = isMenuComplete(menuData);

    return (
        <div className="flex flex-col gap-6 container mx-auto max-w-7xl px-6 py-8 pt-24">
            <WeekHeader
                weekStartDate={week}
                showStatus
                status={currentStatus}
                hasUnsavedChanges={!hasEverSaved || hasUnsavedChanges}
            />


            <MenuTable
                menu={{ id: 0, weekStartDate, data: menuData, status: "draft" }}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                onDishChange={handleDishChange}
                onToggleHoliday={handleToggleHoliday}
            />

            <div className="flex items-center justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleSave("draft")}
                    disabled={savingDraft || publishing}
                >
                    {savingDraft ? <Spinner /> : <Save className="mr-2 size-4" />}
                    Save Draft
                </Button>
                <Button
                    onClick={() => handleSave("published")}
                    disabled={publishing || savingDraft || !canPublish}
                >
                    {publishing ? <Spinner /> : <Globe className="mr-2 size-4" />}
                    Publish
                </Button>
            </div>

            {!canPublish && (
                <p className="text-sm text-muted-foreground text-right">
                    Complete all required slots to publish
                </p>
            )}
        </div>
    );
}

