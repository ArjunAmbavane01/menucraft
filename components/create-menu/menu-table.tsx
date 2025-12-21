import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Weekday, weekdays, WeeklyMenu } from "@/types/menu";
import { Dish, DishCategory } from "@/types/dishes";
import { MenuTableRow } from "./menu-table-row";

interface MenuTableProps {
  menu: WeeklyMenu;
  dishes: Record<number, Dish>;
  orderedCategories: string[];
  todayWeekday: Weekday;
  onCellClick: (day: Weekday, category: DishCategory) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

interface SortableHeaderProps {
  category: string;
}

function SortableHeader({ category }: SortableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className="text-center capitalize font-semibold text-gray-700 bg-gray-50"
    >
      <div className="flex items-center justify-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-gray-200 p-1 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        <span>{category}</span>
      </div>
    </TableHead>
  );
}

export function MenuTable({
  menu,
  dishes,
  orderedCategories,
  todayWeekday,
  onCellClick,
  onDragEnd,
}: MenuTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-48 font-semibold text-gray-700">Day</TableHead>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={orderedCategories} strategy={horizontalListSortingStrategy}>
              {orderedCategories.map((category) => (
                <SortableHeader key={category} category={category} />
              ))}
            </SortableContext>
          </DndContext>
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
            isToday={day === todayWeekday}
          />
        ))}
      </TableBody>
    </Table>
  );
}