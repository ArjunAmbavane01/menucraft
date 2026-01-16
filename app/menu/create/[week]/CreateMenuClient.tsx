"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MenuTable } from "@/components/menu/MenuTable";
import { WeekHeader } from "@/components/menu/WeekHeader";
import { createMenu } from "@/server/menu/menuActions";
import { MenuData, Weekday, MenuStatus } from "@/types/menu";
import { weekToISODate } from "@/lib/week-utils";
import { isMenuComplete } from "@/lib/menu-validation";
import { Save, Globe, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
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
        status === "draft" ? setSavingDraft(true) : setPublishing(true);
        try {
            await createMenu(week, menuData, status);
            toast.success(status === "published" ? "Menu published" : "Draft saved");
        } catch (error: any) {
            toast.error(error.message || "Failed to save menu");
        } finally {
            status === "draft" ? setSavingDraft(false) : setPublishing(false);
        }
    };

    const canPublish = isMenuComplete(menuData);

    return (
        <div className="container mx-auto max-w-7xl px-6 py-8 pt-24">
            <div className="space-y-8 mb-8">
                <Button
                    onClick={() => router.push("/dashboard")}
                    variant={"outline"}
                    size={"sm"}
                >
                    <ArrowLeft /> Go Back
                </Button>
                <WeekHeader weekStartDate={week} />
            </div>

            <MenuTable
                menu={{ id: 0, weekStartDate, data: menuData, status: "draft" }}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                onDishChange={handleDishChange}
                onToggleHoliday={handleToggleHoliday}
            />

            <div className="mt-6 flex items-center justify-end gap-3">
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
                <p className="mt-4 text-sm text-muted-foreground text-right">
                    Complete all required slots to publish
                </p>
            )}
        </div>
    );
}

