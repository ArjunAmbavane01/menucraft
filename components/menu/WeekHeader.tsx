"use client";

import { formatWeekRange } from "@/lib/week-utils";
import { Badge } from "@/components/ui/badge";
import { MenuStatus } from "@/types/menu";

interface WeekHeaderProps {
    weekStartDate: string;
    status?: MenuStatus;
    showStatus?: boolean;
    hasUnsavedChanges?: boolean;
}

export function WeekHeader({
    weekStartDate,
    status,
    showStatus = false,
    hasUnsavedChanges
}: WeekHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <h1 className="text-3xl font-normal">Weekly Menu</h1>
                <p className="text-muted-foreground">
                    Week: {formatWeekRange(weekStartDate)}
                </p>
            </div>
            {showStatus && (
                hasUnsavedChanges ? (
                    <div className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm text-amber-700">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Unsaved changes
                    </div>
                ) : status && (
                    <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                        <span
                            className={`h-2 w-2 rounded-full ${status === "published" ? "bg-green-500" : "bg-amber-500"
                                }`}
                        />
                        <span className="font-medium">
                            {status === "published" ? "Published" : "Draft"}
                        </span>
                    </div>
                )
            )}
        </div>
    );
}

