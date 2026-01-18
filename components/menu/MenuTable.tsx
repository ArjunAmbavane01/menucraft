"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Weekday, weekdays, weekdayLabels, WeeklyMenu, MenuTemplate } from "@/types/menu";
import { DishCategory, Dish } from "@/types/dishes";
import { DishSelect } from "./DishSelect";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Fragment } from "react/jsx-runtime";
import { SnackMultiSelect } from "./SnackMultiSelect";

interface MenuTableProps {
    menu: WeeklyMenu;
    dishesByCategory: Record<string, Dish[]>;
    lastUsedMap: Record<number, string | null>;
    onDishChange: (day: Weekday, category: DishCategory, dishId: number) => void;
    onToggleHoliday: (day: Weekday) => void;
    onSnacksChange: (day: Weekday, snackIds: number[]) => void;
    readOnly?: boolean;
}

export function MenuTable({
    menu,
    dishesByCategory,
    lastUsedMap,
    onDishChange,
    onToggleHoliday,
    onSnacksChange,
    readOnly = false,
}: MenuTableProps) {
    const today = new Date();
    const todayWeekday = today.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as Weekday;

    // Get all unique categories from MenuTemplate
    const allCategories = Array.from(
        new Set(Object.values(MenuTemplate).flat())
    ) as DishCategory[];

    const snackDishes = dishesByCategory["egg"] || [];

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-48 font-semibold pl-3">Day</TableHead>
                        {allCategories.map((category) => (
                            <TableHead
                                key={category}
                                className="text-center capitalize font-semibold"
                            >
                                {category}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {weekdays.map((day) => {
                        const dayData = menu.data[day];
                        const isHoliday = dayData?.isHoliday || false;
                        const isToday = day === todayWeekday;
                        const categoriesForDay = MenuTemplate[day];
                        const eveningSnacks = dayData?.eveningSnacks || [];

                        return (
                            <Fragment key={day}>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {!readOnly && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7"
                                                    onClick={() => onToggleHoliday(day)}
                                                    title={isHoliday ? "Unmark as holiday" : "Mark as holiday"}
                                                >
                                                    <Calendar className={cn("size-4", isHoliday && "text-amber-700")} />
                                                </Button>
                                            )}
                                            <span className={cn(isHoliday && "text-muted-foreground")}>
                                                {weekdayLabels[day]}
                                            </span>
                                            {isToday && !isHoliday && (
                                                <Badge variant="default" className="text-xs">
                                                    Today
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    {allCategories.map((category) => {
                                        const dishId = dayData?.dishes?.[category];
                                        const dishes = dishesByCategory[category] || [];

                                        // Hide category if not in template for this day
                                        if (!categoriesForDay.includes(category)) {
                                            return <TableCell key={category}></TableCell>;
                                        }

                                        if (readOnly) {
                                            const dish = dishes.find((d) => d.id === dishId);
                                            return (
                                                <TableCell key={category} className="text-center">
                                                    {isHoliday ? (
                                                        <span className="text-sm text-muted-foreground text">—</span>
                                                    ) : dish ? (
                                                        <TooltipProvider delayDuration={300}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors cursor-default">
                                                                        <span className="text-sm font-medium">{dish.name}</span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                {lastUsedMap[dish.id] && (
                                                                    <TooltipContent side="top" className="text-xs opacity-85">
                                                                        <p>Last used: {lastUsedMap[dish.id]}</p>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell key={category} className="text-center">
                                                {isHoliday ? (
                                                    <span className="text-sm text-muted-foreground text">—</span>
                                                ) : (
                                                    <DishSelect
                                                        category={category}
                                                        value={dishId}
                                                        onChange={(id) => onDishChange(day, category, id)}
                                                        dishes={dishes}
                                                        lastUsedMap={lastUsedMap}
                                                        placeholder={`Select ${category}...`}
                                                    />
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                                {/* Evening Snacks Row */}
                                {!isHoliday && (
                                    <TableRow>
                                        <TableCell colSpan={allCategories.length + 1} className="bg-muted/20 py-3">
                                            <div className="flex items-start gap-3 pl-2">
                                                <span className="text-sm font-medium text-muted-foreground min-w-[120px] pt-1">
                                                    Evening Snacks:
                                                </span>
                                                {readOnly ? (
                                                    eveningSnacks.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {eveningSnacks.map((snackId) => {
                                                                const snack = snackDishes.find((d) => d.id === snackId);
                                                                return snack ? (
                                                                    <Badge key={snackId} variant="secondary" className="text-sm font-normal">
                                                                        {snack.name}
                                                                    </Badge>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )
                                                ) : (
                                                    <SnackMultiSelect
                                                        value={eveningSnacks}
                                                        onChange={(ids) => onSnacksChange?.(day, ids)}
                                                        dishes={snackDishes}
                                                        lastUsedMap={lastUsedMap}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

