"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Weekday, weekdays, MenuTemplate } from "@/types/menu";
import { Dish } from "@/types/dishes";

interface Props {
    menu: any;
    allDishes: Dish[];
}

export default function MenuViewPage({ menu, allDishes }: Props) {
    const router = useRouter();

    const dishMap: Record<number, Dish> = {};
    allDishes.forEach((d) => (dishMap[d.id] = d));

    const allCategories = Array.from(new Set(Object.values(MenuTemplate).flat()));

    return (
        <div className="container mx-auto max-w-6xl px-6 py-10">

            {/* Back */}
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
                Week starting: {new Date(menu.weekStartDate).toLocaleDateString()}
            </p>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow className="text-base">
                            <TableHead className="w-32">Day</TableHead>
                            {allCategories.map((cat) => (
                                <TableHead key={cat} className="text-left capitalize">
                                    {cat}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {weekdays.map((day) => (
                            <TableRow key={day}>
                                <TableCell className="font-medium capitalize">{day}</TableCell>

                                {MenuTemplate[day].map((cat) => {
                                    const dishId = menu.data[day]?.[cat];
                                    const dish = dishId ? dishMap[dishId] : null;

                                    return (
                                        <TableCell key={cat} className="text-base text-left">
                                            <span >
                                                {dish ? dish.name : <span className="italic text-gray-500">—</span>}
                                            </span>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

        </div>
    );
}
