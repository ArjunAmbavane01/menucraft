"use client";

import { formatWeekRange } from "@/lib/week-utils";
import { Badge } from "@/components/ui/badge";
import { MenuStatus } from "@/types/menu";

interface WeekHeaderProps {
    weekStartDate: string;
    status?: MenuStatus;
    showStatus?: boolean;
}

export function WeekHeader({
    weekStartDate,
    status,
    showStatus = false,
}: WeekHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-3">
                <h1 className="text-3xl font-semibold">Weekly Menu</h1>
                <p className="text-lg text-muted-foreground">
                    Week: {formatWeekRange(weekStartDate)}
                </p>
            </div>
            {showStatus && status && (
                <Badge variant={status === "published" ? "default" : "secondary"}>
                    {status === "published" ? "Published" : "Draft"}
                </Badge>
            )}
        </div>
    );
}

