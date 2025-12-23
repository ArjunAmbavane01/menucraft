"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteMenu } from "@/server/menu/deleteMenu";
import { saveMenu } from "@/server/menu/saveMenu";
import { Weekday, WeeklyMenu } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";
import { DishSelectionDialog } from "./dish-selection-dialog";
import { MenuPageHeader } from "./menu-page-header";
import { MenuTable } from "./menu-table";
import { toast } from "sonner";

interface CreateMenuPageProps {
  menu: WeeklyMenu;
  dishesByCategory: Record<string, { id: number; name: string }[]>;
}

export default function CreateMenuPage({
  menu: initialMenu,
  dishesByCategory,
}: CreateMenuPageProps) {

  const [menu, setMenu] = useState<WeeklyMenu>(initialMenu);
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date(initialMenu.weekStartDate));
  const [dishes, setDishes] = useState<Record<number, Dish>>({});
  const [saving, setSaving] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    day: Weekday;
    category: DishCategory;
  } | null>(null);
  const [availableDishes, setAvailableDishes] = useState<Dish[]>([]);

  const [orderedCategories] = useState<string[]>(Object.keys(dishesByCategory));

  const router = useRouter();

  useEffect(() => {
    const flat: Record<number, Dish> = {};

    for (const category in dishesByCategory) {
      for (const d of dishesByCategory[category]) {
        flat[d.id] = {
          id: d.id,
          name: d.name,
          category: category as DishCategory,
        };
      }
    }

    setDishes(flat);
  }, [dishesByCategory]);

  // Update menu when date changes
  useEffect(() => {
    const year = weekStartDate.getFullYear();
    const month = String(weekStartDate.getMonth() + 1).padStart(2, '0');
    const day = String(weekStartDate.getDate()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;

    setMenu((prev) => ({
      ...prev,
      weekStartDate: localDateString,
    }));
  }, [weekStartDate]);

  const handleToggleHoliday = (day: Weekday) => {
    setMenu((prev) => {
      const isCurrentlyHoliday = prev.data[day].isHoliday;

      return {
        ...prev,
        data: {
          ...prev.data,
          [day]: {
            ...prev.data[day],
            isHoliday: !isCurrentlyHoliday,
            // dishes: isCurrentlyHoliday ? prev.data[day].dishes : {},
          },
        },
      };
    });
  };

  const handleCellClick = (day: Weekday, category: DishCategory) => {
    setSelectedCell({ day, category });

    const list = dishesByCategory[category] ?? [];
    const formatted = list.map((d) => ({
      id: d.id,
      name: d.name,
      category: category,
    }));

    setAvailableDishes(formatted);
    setDialogOpen(true);
  };

  const handleDishSelect = (dish: Dish) => {
    if (!selectedCell) return;

    setMenu((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [selectedCell.day]: {
          isHoliday: prev.data[selectedCell.day].isHoliday,
          dishes: {
            ...prev.data[selectedCell.day].dishes,
            [selectedCell.category]: dish.id,
          },
        },
      },
    }));
    
    setDialogOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log(menu);
      await saveMenu(menu);
      toast.success("Weekly menu saved.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenu(menu.id);
      toast.success("Menu deleted.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleWeekChange = (date: Date) => {
    const selectedDate = new Date(date);

    const dayOfWeek = selectedDate.getDay();

    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const mondayDate = new Date(selectedDate);
    mondayDate.setDate(selectedDate.getDate() - daysToMonday);

    mondayDate.setHours(0, 0, 0, 0);
    setWeekStartDate(mondayDate);
  };

  // Get today's weekday
  const today = new Date();
  const todayWeekday = today
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as Weekday;

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <MenuPageHeader
        weekStartDate={weekStartDate}
        saving={saving}
        menu={menu}
        dishes={dishes}
        orderedCategories={orderedCategories}
        onWeekChange={handleWeekChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Menu Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <MenuTable
          menu={menu}
          dishes={dishes}
          orderedCategories={orderedCategories}
          todayWeekday={todayWeekday}
          onCellClick={handleCellClick}
          onToggleHoliday={handleToggleHoliday}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <div className="size-4 bg-blue-100 border border-blue-500 rounded"></div>
          <span>Filled slot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 bg-red-100 border-2 border-dashed border-red-300 rounded"></div>
          <span>Empty slot</span>
        </div>
      </div>

      {/* Dish Selection Dialog */}
      <DishSelectionDialog
        open={dialogOpen}
        selectedDay={selectedCell?.day ?? null}
        selectedCategory={selectedCell?.category ?? null}
        availableDishes={availableDishes}
        onOpenChange={setDialogOpen}
        onDishSelect={handleDishSelect}
      />
    </div>
  );
}