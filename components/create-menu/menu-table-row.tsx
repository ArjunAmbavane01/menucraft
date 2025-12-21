import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { Weekday, WeeklyMenu } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";

interface MenuTableRowProps {
  day: Weekday;
  categories: string[];
  menu: WeeklyMenu;
  dishes: Record<number, Dish>;
  onCellClick: (day: Weekday, category: DishCategory) => void;
  isToday: boolean;
}

const weekdayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export function MenuTableRow({ 
  day, 
  categories, 
  menu, 
  dishes, 
  onCellClick, 
  isToday 
}: MenuTableRowProps) {
  return (
    <TableRow className={cn(isToday && "bg-blue-50/50")}>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="capitalize font-semibold">{weekdayLabels[day]}</span>
          {isToday && (
            <Badge variant="default" className="w-fit text-xs mt-1">
              Today
            </Badge>
          )}
        </div>
      </TableCell>

      {categories.map((category) => {
        const cat = category as DishCategory;
        const dishId = menu.data[day]?.[cat];
        const dish = dishId ? dishes[dishId] : null;
        const isEmpty = !dish;

        return (
          <TableCell key={category} className="text-center">
            <button
              onClick={() => onCellClick(day, cat)}
              className={cn(
                "w-full px-3 py-3 text-left rounded-lg transition-all flex items-center justify-between group",
                isEmpty
                  ? "border-2 border-dashed border-red-200 hover:border-red-400 bg-red-50/30"
                  : "border border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              )}
            >
              <span className={cn("text-sm", isEmpty ? "text-red-400 italic" : "text-gray-700")}>
                {dish ? dish.name : "No dish"}
              </span>
              {isEmpty ? (
                <AlertCircle className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </TableCell>
        );
      })}
    </TableRow>
  );
}