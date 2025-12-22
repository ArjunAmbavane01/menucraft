"use client";

import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { Weekday, weekdays, WeeklyMenu } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";
import { MenuTable } from "./menu-table";
import { DishSelectionDialog } from "./dish-selection-dialog";
import { MenuPageHeader } from "./menu-page-header";
import { toast } from "sonner";
import { saveMenu } from "@/server/menu/saveMenu";
import { useRouter } from "next/navigation";
import { deleteMenu } from "@/server/menu/deleteMenu";

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

  const router = useRouter();

  // Drag and drop for columns
  const [orderedCategories, setOrderedCategories] = useState<string[]>(
    Object.keys(dishesByCategory)
  );

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
    setMenu((prev) => ({
      ...prev,
      weekStartDate: weekStartDate.toISOString().split("T")[0],
    }));
  }, [weekStartDate]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedCategories((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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

    const updatedMenu = {
      ...menu,
      data: {
        ...menu.data,
        [selectedCell.day]: {
          ...menu.data[selectedCell.day],
          [selectedCell.category]: dish.id,
        },
      },
    };

    setMenu(updatedMenu);
    setDialogOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
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

  // Get today's weekday
  const today = new Date();
  const todayWeekday = today
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as Weekday;

  // Count empty cells
  const emptyCellsCount = weekdays.reduce((count, day) => {
    const categories = orderedCategories as DishCategory[];
    const emptyInDay = categories.filter((cat) => !menu.data[day]?.[cat]).length;
    return count + emptyInDay;
  }, 0);

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <MenuPageHeader
        weekStartDate={weekStartDate}
        emptyCellsCount={emptyCellsCount}
        saving={saving}
        onWeekChange={setWeekStartDate}
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
          onDragEnd={handleDragEnd}
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
        <div className="flex items-center gap-2">
          <div className="size-4 bg-blue-100 rounded"></div>
          <span>Today's row</span>
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