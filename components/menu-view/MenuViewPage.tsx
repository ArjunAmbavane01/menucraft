"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { weekdays, MenuTemplate, WeeklyMenu, Weekday } from "@/types/menu";
import { Dish } from "@/types/dishes";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface Props {
    menu: WeeklyMenu;
    allDishes: Dish[];
}

export default function MenuViewPage({ menu, allDishes }: Props) {
    const router = useRouter();

    const dishMap: Record<number, Dish> = {};
    allDishes.forEach((d) => (dishMap[d.id] = d));

    const allCategories = Array.from(new Set(Object.values(MenuTemplate).flat()));

    return (
        <div className="container mx-auto max-w-6xl px-6 py-10">

            <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6"
            >
                <ArrowLeft className="size-4" />
                Back
            </Button>

            <h1 className="text-3xl font-semibold mb-4">Weekly Menu</h1>
            <p className="text-gray-600 mb-6">
                Week starting: {new Date(menu.weekStartDate).toLocaleDateString("en-IN")}
            </p>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow className="text-base">
                            <TableHead className="w-32 px-3">Day</TableHead>
                            {allCategories.map((cat) => (
                                <TableHead key={cat} className="text-left capitalize">
                                    {cat}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {weekdays.map((day) => {
                            const isHoliday = menu.data[day]?.isHoliday || false;

                            return (
                                <TableRow
                                    key={day}
                                    className={cn(
                                        isHoliday && "bg-linear-to-r from-orange-50 to-amber-50"
                                    )}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "capitalize font-semibold",
                                                isHoliday && "text-orange-700"
                                            )}>
                                                {day}
                                            </span>
                                            {isHoliday && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-orange-100 text-orange-700 border-orange-200"
                                                >
                                                    <PartyPopper className="size-3 mr-1" />
                                                    Holiday
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {isHoliday ? (
                                        <TableCell
                                            colSpan={allCategories.length}
                                            className="text-center py-5"
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="text-lg font-normal text-orange-700 italic">
                                                    Enjoy your holiday! 🎉
                                                </span>
                                            </div>
                                        </TableCell>
                                    ) : (
                                        allCategories.map((cat) => {
                                            const categoriesForDay = MenuTemplate[day];
                                            const isCategoryForDay = categoriesForDay.includes(cat);
                                            const dishId = menu.data[day]?.dishes?.[cat];
                                            const dish = dishId ? dishMap[dishId] : null;

                                            return (
                                                <TableCell key={cat} className="text-base text-left px-3">
                                                    {isCategoryForDay ? (
                                                        <span>
                                                            {dish ? dish.name : <span className="italic text-gray-500">—</span>}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </TableCell>
                                            );
                                        })
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

        </div>
    );
}
