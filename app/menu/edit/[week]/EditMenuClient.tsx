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
import { Save, Globe, Lock, AlertTriangle } from "lucide-react";
import { DishCategory } from "@/types/dishes";
import { Spinner } from "@/components/ui/spinner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const weekStartDate = weekToISODate(week);

    const [savingDraft, setSavingDraft] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [unpublishing, setUnpublishing] = useState(false);
    const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);

    const dishesByCategory: Record<string, { id: number; name: string; category: string }[]> = {};
    for (const [category, dishes] of Object.entries(rawDishesByCategory)) {
        dishesByCategory[category] = dishes;
    }

    const initialData = { ...initialMenu.data };
    if (initialData.meta) delete (initialData as any).meta;

    const [menuData, setMenuData] = useState<MenuData>(initialData as MenuData);

    const currentStatus = initialMenu.data.meta?.status || initialMenu.status;
    const isPublished = currentStatus === "published";

    const handleDishChange = (day: Weekday, category: DishCategory, dishId: number) => {
        if (isPublished) return;

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
        if (isPublished) return;

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
            await updateMenu(week, menuData, status);
            toast.success(status === "published" ? "Menu published" : "Draft saved");
        } catch (error: any) {
            toast.error(error.message || "Failed to save menu");
        } finally {
            status === "draft" ? setSavingDraft(false) : setPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        setUnpublishing(true);
        try {
            await updateMenu(week, menuData, "draft");
            toast.success("Menu unpublished");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to unpublish menu");
        } finally {
            setUnpublishing(false);
            setShowUnpublishDialog(false);
        }
    };

    const canPublish = isMenuComplete(menuData);

    return (
        <div className="flex flex-col gap-6 container mx-auto max-w-7xl px-6 py-28">
            <WeekHeader weekStartDate={week} status={currentStatus} showStatus />

            {isPublished && (
                <div className="flex items-center rounded border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3 w-full">
                        <Lock className="size-5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text font-medium text-amber-900">
                                This menu is published
                            </p>
                            <p className="text-sm text-amber-700">
                                Unpublish to make changes. This will remove the menu from public view.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUnpublishDialog(true)}
                        disabled={unpublishing}
                        className="shrink-0"
                    >
                        {unpublishing ? <Spinner /> : "Unpublish"}
                    </Button>
                </div>
            )}

            <MenuTable
                menu={{ id: initialMenu.id, weekStartDate, data: menuData, status: currentStatus }}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                onDishChange={handleDishChange}
                onToggleHoliday={handleToggleHoliday}
            />

            {!isPublished && (
                <>
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
                </>
            )}

            <AlertDialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                                <AlertTriangle className="size-5 text-amber-700" />
                            </div>
                            <AlertDialogTitle className="text-lg">
                                Unpublish menu?
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base">
                            This will remove the menu from public view. Users won't be able to see this week's menu until you publish it again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 mt-3">
                        <AlertDialogCancel disabled={unpublishing}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleUnpublish();
                            }}
                            disabled={unpublishing}
                            className="bg-amber-600 hover:bg-amber-800 focus:ring-amber-600"
                        >
                            {unpublishing && <Spinner />}
                            Unpublish menu
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

