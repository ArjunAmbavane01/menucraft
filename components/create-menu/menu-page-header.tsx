import { useState } from "react";
import { useRouter } from "next/navigation";
import { WeeklyMenu, weekdays, weekdayLabels } from "@/types/menu";
import { Dish } from "@/types/dishes";
import { format } from "date-fns";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { CiExport, CiSaveDown1 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

interface MenuPageHeaderProps {
  menu: WeeklyMenu;
  weekStartDate: Date;
  saving: boolean;
  dishes: Record<number, Dish>;
  orderedCategories: string[];
  onWeekChange: (date: Date) => void;
  onSave: () => void;
  onDelete: () => void;
}

export function MenuPageHeader({
  menu,
  weekStartDate,
  saving,
  dishes,
  orderedCategories,
  onWeekChange,
  onSave,
  onDelete,
}: MenuPageHeaderProps) {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();

  const handleExport = () => {
    let exportText = "";

    const startDate = new Date(weekStartDate);

    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + diff);

    weekdays.forEach((day, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);

      const dateStr = format(currentDate, "dd/MM/yy");
      const dayLabel = weekdayLabels[day];

      exportText += `${dayLabel} ${dateStr}\n`;

      const dayData = menu.data[day];
      const isHoliday = dayData?.isHoliday;

      // Check if it's a holiday
      if (isHoliday) {
        exportText += "Holiday\n";
      } else {
        // Add dishes for this day
        orderedCategories.forEach((category) => {
          const dishId = dayData?.dishes?.[category as keyof typeof dayData.dishes];
          const dish = dishId ? dishes[dishId] : null;

          if (dish) {
            exportText += `${category}: ${dish.name}\n`;
          }
        });
      }

      exportText += "\n";
    });

    navigator.clipboard.writeText(exportText.trim())
      .then(() => {
        toast.success("Menu copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="flex flex-col gap-10 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.refresh();
              router.back();
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <h1 className="text-2xl font-semibold">Weekly Menu Planner</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">Week starting:</span>
            <Badge variant="outline" className="text-xs rounded p-1">
              {format(weekStartDate, "MMMM dd, yyyy")}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2">
                <CalendarIcon className="size-4" />
                Change Week
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={weekStartDate}
                onSelect={(date) => date && onWeekChange(date)}
              />
            </PopoverContent>
          </Popover>

          {/* Save */}
          <Button onClick={onSave} disabled={saving} size="lg" className="gap-2">
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CiSaveDown1 className="size-4" />
                Save
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            size="icon-lg"
            className="gap-2"
            onClick={() => setConfirmOpen(true)}
          >
            <MdDelete />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleExport}
          >
            <CiExport />
          </Button>
        </div>
      </div>


      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Weekly Menu?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The weekly menu will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 gap-2"
              onClick={onDelete}
            >
              <MdDelete />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}