import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, AlertCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Weekday, WeeklyMenu, weekdayLabels } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";
import { Button } from "../ui/button";

interface MenuTableRowProps {
  day: Weekday;
  categories: string[];
  menu: WeeklyMenu;
  dishes: Record<number, Dish>;
  onCellClick: (day: Weekday, category: DishCategory) => void;
  onToggleHoliday: (day: Weekday) => void;
  isToday: boolean;
}

export function MenuTableRow({
  day,
  categories,
  menu,
  dishes,
  onCellClick,
  onToggleHoliday,
  isToday
}: MenuTableRowProps) {
  const isHoliday = menu.data[day]?.isHoliday || false;

  return (
    <TableRow>
      <TableCell className="font-medium p-4 py-5">
        <div className="flex items-center gap-3">
          <span className={cn("capitalize font-semibold", isHoliday && "text-gray-400")}>
            {weekdayLabels[day]}
          </span>
          {isToday && !isHoliday && (
            <Badge variant="default" className="w-fit text-xs mt-1 rounded">
              Today
            </Badge>
          )}
          {isHoliday && (
            <Badge variant="secondary" className="w-fit text-xs mt-1 rounded bg-orange-100 text-orange-700">
              Holiday
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleHoliday(day)}
            className="ml-auto h-7 px-2 text-xs"
            title={isHoliday ? "Unmark as holiday" : "Mark as holiday"}
          >
            <Calendar className={cn("size-4", isHoliday && "text-orange-600")} />
          </Button>
        </div>
      </TableCell>
      {categories.map((category) => {
        const cat = category as DishCategory;
        const dishId = menu.data[day]?.dishes?.[cat];
        const dish = dishId ? dishes[dishId] : null;
        const isEmpty = !dish;

        return (
          <TableCell key={category} className="text-center p-4 py-5">
            <Button
              variant={"outline"}
              onClick={() => !isHoliday && onCellClick(day, cat)}
              disabled={isHoliday}
              className={cn(
                "w-full p-4 text-left rounded-lg transition-all flex items-center justify-between group cursor-pointer",
                isHoliday
                  ? "border border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                  : isEmpty
                    ? "border-2 border-dashed border-red-200 hover:border-red-400 hover:bg-red-50 bg-red-50"
                    : "border border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              )}
            >
              <span className={cn(
                "text-sm",
                isHoliday ? "text-gray-400" : isEmpty ? "text-red-400" : "text-gray-800"
              )}>
                {isHoliday ? "Holiday" : dish ? dish.name : "No dish"}
              </span>
              {!isHoliday && (
                isEmpty ? (
                  <AlertCircle className="size-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Edit className="size-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )
              )}
            </Button>
          </TableCell>
        );
      })}
    </TableRow>
  );
}