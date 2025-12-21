import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

import { Weekday } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";

interface DishSelectionDialogProps {
  open: boolean;
  selectedDay: Weekday | null;
  selectedCategory: DishCategory | null;
  availableDishes: Dish[];
  onOpenChange: (open: boolean) => void;
  onDishSelect: (dish: Dish) => void;
}

const weekdayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export function DishSelectionDialog({
  open,
  selectedDay,
  selectedCategory,
  availableDishes,
  onOpenChange,
  onDishSelect,
}: DishSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = availableDishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="capitalize text-xl">
            Select {selectedCategory} for {selectedDay && weekdayLabels[selectedDay]}
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredDishes.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No dishes found</p>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <button
                key={dish.id}
                onClick={() => onDishSelect(dish)}
                className="w-full px-4 py-3 text-left rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="font-medium text-gray-800">{dish.name}</div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}