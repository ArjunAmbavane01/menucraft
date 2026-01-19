"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Weekday, weekdays, weekdayLabels, WeeklyMenu, MenuTemplate } from "@/types/menu";
import { DishCategory, LastUsedMap, DishesByCategory, ALL_CATEGORIES } from "@/types/dishes";
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
    dishesByCategory: DishesByCategory;
    lastUsedMap: LastUsedMap;
    onDishChange: (day: Weekday, category: DishCategory, dishId: number | null) => void;
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
    const allCategories = ALL_CATEGORIES

    const snackDishes = dishesByCategory["snack"] || [];

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-medium pl-3 min-w-44">Day</TableHead>
                        {allCategories.map((category) => {
                            if (category === "snack") return null;
                            return (
                                <TableHead
                                    key={category}
                                    className="text-center capitalize font-semibold"
                                >
                                    {category}
                                </TableHead>
                            )
                        })}
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
                                <TableRow className={cn(isHoliday && "bg-amber-50/50")}>
                                    <TableCell className="font-medium">
                                        <div className={cn(
                                            "flex items-center gap-2",
                                            readOnly && "pl-1"
                                        )}>
                                            {!readOnly && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onToggleHoliday(day)}
                                                    title={isHoliday ? "Unmark as holiday" : "Mark as holiday"}
                                                >
                                                    <Calendar className={cn("size-4", isHoliday && "text-amber-700")} />
                                                </Button>
                                            )}
                                            <span className={cn(isHoliday && "font-medium text-amber-900")}>
                                                {weekdayLabels[day]}
                                            </span>
                                            {isToday && !isHoliday && (
                                                <Badge variant="outline" className="text-xs mt-0.5">
                                                    Today
                                                </Badge>
                                            )}
                                            {isHoliday && (
                                                <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 mt-0.5">
                                                    Holiday
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    {isHoliday ? (
                                        <TableCell colSpan={allCategories.filter(c => c !== "snack" && categoriesForDay.includes(c)).length}>
                                            <div className="flex items-center justify-center gap-2 py-2">
                                                <Calendar className="size-4 text-amber-600" />
                                                <span className="text-sm font-medium text-amber-700">No menu scheduled</span>
                                            </div>
                                        </TableCell>
                                    ) : (
                                        allCategories.map((category) => {
                                            const dishId = dayData?.dishes?.[category];
                                            const dishes = dishesByCategory[category] || [];

                                            if (category === "snack") return null;

                                            // Hide category if not in template for this day
                                            if (!categoriesForDay.includes(category)) return null;

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
                                                                        <div className="inline-flex text-sm font-medium truncate max-w-48">
                                                                            {dish.name}
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
                                                            placeholder={`Select ${category}`}
                                                        />
                                                    )}
                                                </TableCell>
                                            );
                                        }))}
                                </TableRow>

                                {/* Evening Snacks Row */}
                                {!isHoliday && (
                                    <TableRow>
                                        {/* Label cell */}
                                        <TableCell className="bg-muted/20 pl-3">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Evening Snacks:
                                            </span>
                                        </TableCell>

                                        {/* Content cell */}
                                        <TableCell colSpan={allCategories.length} className="bg-muted/20">
                                            {readOnly ? (
                                                eveningSnacks.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {eveningSnacks.map((snackId) => {
                                                            const snack = snackDishes.find((d) => d.id === snackId);
                                                            return snack ? (
                                                                <TooltipProvider key={snackId} delayDuration={300}>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="text-sm font-normal shadow-xs rounded-sm truncate max-w-48"
                                                                            >
                                                                                {snack.name}
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        {lastUsedMap[snack.id] && (
                                                                            <TooltipContent side="top" className="text-xs opacity-85">
                                                                                <p>Last used: {lastUsedMap[snack.id]}</p>
                                                                            </TooltipContent>
                                                                        )}
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground pl-8">—</span>
                                                )
                                            ) : (
                                                <SnackMultiSelect
                                                    value={eveningSnacks}
                                                    onChange={(ids) => onSnacksChange?.(day, ids)}
                                                    dishes={snackDishes}
                                                    lastUsedMap={lastUsedMap}
                                                />
                                            )}
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

