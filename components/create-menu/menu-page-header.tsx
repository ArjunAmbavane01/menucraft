import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Calendar as CalendarIcon, AlertCircle, ArrowLeft } from "lucide-react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MenuPageHeaderProps {
  weekStartDate: Date;
  emptyCellsCount: number;
  saving: boolean;
  onWeekChange: (date: Date) => void;
  onSave: () => void;
  onDelete: () => void;
}

export function MenuPageHeader({
  weekStartDate,
  emptyCellsCount,
  saving,
  onWeekChange,
  onSave,
  onDelete,
}: MenuPageHeaderProps) {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const today = new Date();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-10 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
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

          {/* {emptyCellsCount > 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="size-4" />
              <span className="text-sm font-medium">
                {emptyCellsCount} empty {emptyCellsCount === 1 ? "slot" : "slots"}
              </span>
            </div>
          )} */}
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
                initialFocus
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
              "Save"
            )}
          </Button>

          {/* Delete (opens confirmation) */}
          <Button
            variant="destructive"
            size="lg"
            className="gap-2"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
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