import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface MenuPageHeaderProps {
  weekStartDate: Date;
  emptyCellsCount: number;
  saving: boolean;
  onWeekChange: (date: Date) => void;
  onSave: () => void;
}

export function MenuPageHeader({
  weekStartDate,
  emptyCellsCount,
  saving,
  onWeekChange,
  onSave,
}: MenuPageHeaderProps) {
  const today = new Date();

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
      <div className="space-y-10">
        <h1 className="text-3xl">Weekly Menu Planner</h1>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            {/* <CalendarIcon className="stroke-1 size-4" /> */}
            <div className="flex items-start gap-3">
              <span className="font-normal">Week starting:</span>
              <Badge variant="outline" className="text-xs rounded p-1">
                {format(weekStartDate, "MMMM dd, yyyy")}
              </Badge>
            </div>
          </div>
          {emptyCellsCount > 0 && (
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="size-4" />
              <span className="text-sm font-medium">
                {emptyCellsCount} empty {emptyCellsCount === 1 ? "slot" : "slots"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="size-4" />
              Change Week
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={weekStartDate}
              onSelect={(date) => date && onWeekChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button onClick={onSave} disabled={saving} size="lg" className="gap-2">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Menu"
          )}
        </Button>
      </div>
    </div>
  );
}