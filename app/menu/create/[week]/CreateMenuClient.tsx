"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { createMenu } from "@/server/menu/menuActions";
import { MenuData, Weekday, MenuStatus } from "@/types/menu";
import { weekToISODate } from "@/lib/week-utils";
import { isMenuComplete } from "@/lib/menu-validation";
import { Save, Globe } from "lucide-react";
import { Dish, DishCategory } from "@/types/dishes";
import { Spinner } from "@/components/ui/spinner";

interface CreateMenuClientProps {
    week: string;
    dishesByCategory: Record<string, Dish[]>;
    lastUsedMap: Record<number, string | null>;
}

export default function CreateMenuClient({
    week,
    dishesByCategory,
    lastUsedMap,
}: CreateMenuClientProps) {
    const weekStartDate = weekToISODate(week);

    const [savingDraft, setSavingDraft] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<MenuStatus>("draft");
    const [hasEverSaved, setHasEverSaved] = useState(false);

    const [menuData, setMenuData] = useState<MenuData>({
        monday: { isHoliday: false, dishes: {}, eveningSnacks: [] },
        tuesday: { isHoliday: false, dishes: {}, eveningSnacks: [] },
        wednesday: { isHoliday: false, dishes: {}, eveningSnacks: [] },
        thursday: { isHoliday: false, dishes: {}, eveningSnacks: [] },
        friday: { isHoliday: false, dishes: {}, eveningSnacks: [] },
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

    const handleSnacksChange = (day: Weekday, snackIds: number[]) => {
        setHasUnsavedChanges(true);
        setMenuData((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                eveningSnacks: snackIds,
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
        <div className="flex flex-col gap-6 container mx-auto max-w-7xl px-6 py-28">
            <WeekHeader
                weekStartDate={week}
                status={currentStatus}
                hasUnsavedChanges={!hasEverSaved || hasUnsavedChanges}
                showStatus={true}
            />


            <MenuTable
                menu={{ id: 0, weekStartDate, data: menuData, status: "draft" }}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                onDishChange={handleDishChange}
                onToggleHoliday={handleToggleHoliday}
                onSnacksChange={handleSnacksChange}
            />

            <div className="flex items-center justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleSave("draft")}
                    disabled={savingDraft || publishing}
                >
                    {savingDraft ? <Spinner /> : <Save />}
                    Save Draft
                </Button>
                <Button
                    onClick={() => handleSave("published")}
                    disabled={publishing || savingDraft || !canPublish}
                >
                    {publishing ? <Spinner /> : <Globe />}
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

