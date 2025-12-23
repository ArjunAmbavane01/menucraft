import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Weekday, weekdays, WeeklyMenu } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";
import { MenuTableRow } from "./menu-table-row";

interface MenuTableProps {
  menu: WeeklyMenu;
  dishes: Record<number, Dish>;
  orderedCategories: string[];
  todayWeekday: Weekday;
  onCellClick: (day: Weekday, category: DishCategory) => void;
  onToggleHoliday: (day: Weekday) => void;
}

interface SortableHeaderProps {
  category: string;
}

export function MenuTable({
  menu,
  dishes,
  orderedCategories,
  todayWeekday,
  onCellClick,
  onToggleHoliday,
}: MenuTableProps) {

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          <TableHead className="w-48 font-semibold text-gray-800 p-4">Day</TableHead>
          {orderedCategories.map((category) => (
            <TableHead
              key={category}
              className="text-center capitalize font-semibold text-gray-800 bg-muted p-4"
            >
              {category}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {weekdays.map((day) => (
          <MenuTableRow
            key={day}
            day={day}
            categories={orderedCategories}
            menu={menu}
            dishes={dishes}
            onCellClick={onCellClick}
            onToggleHoliday={onToggleHoliday}
            isToday={day === todayWeekday}
          />
        ))}
      </TableBody>
    </Table>
  );
}