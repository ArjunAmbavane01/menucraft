import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { Weekday, WeeklyMenu } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";
import { Button } from "../ui/button";

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
    <TableRow>
      <TableCell className="font-medium p-4 py-5">
        <div className="flex items-center gap-3">
          <span className="capitalize font-semibold">{weekdayLabels[day]}</span>
          {isToday && (
            <Badge variant="default" className="w-fit text-xs mt-1 rounded">
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
          <TableCell key={category} className="text-center p-4 py-5">
            <Button
            variant={"outline"}
              onClick={() => onCellClick(day, cat)}
              className={cn(
                "w-full p-4 text-left rounded-lg transition-all flex items-center justify-between group cursor-pointer",
                isEmpty
                  ? "border-2 border-dashed border-red-200 hover:border-red-400 hover:bg-red-50 bg-red-50"
                  : "border border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              )}
            >
              <span className={cn("text-sm", isEmpty ? "text-red-400" : "text-gray-800")}>
                {dish ? dish.name : "No dish"}
              </span>
              {isEmpty ? (
                <AlertCircle className="size-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Edit className="size-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
          </TableCell>
        );
      })}
    </TableRow>
  );
}