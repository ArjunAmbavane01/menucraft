"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { WeeklyMenu, MenuStatus } from "@/types/menu";
import { formatWeekRange, formatWeekDate, getNextWeekStart, getWeekStart } from "@/lib/week-utils";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CalendarIcon, PlusCircle, Edit, Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface DashboardProps {
    menusByPeriod: {
        thisWeek: WeeklyMenu | null;
        upcoming: WeeklyMenu[];
        past: WeeklyMenu[];
    };
}

export default function DashboardPage({ menusByPeriod }: DashboardProps) {
    const router = useRouter();
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const handleCreateNextWeek = () => {
        const nextWeekStart = getNextWeekStart();
        const weekFormat = formatWeekDate(nextWeekStart);
        router.push(`/menu/create/${weekFormat}`);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;

        // Find the Monday of the selected week
        const dayOfWeek = date.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const mondayDate = new Date(date);
        mondayDate.setDate(date.getDate() - daysToMonday);
        mondayDate.setHours(0, 0, 0, 0);

        const weekFormat = formatWeekDate(mondayDate);
        setDatePickerOpen(false);
        router.push(`/menu/create/${weekFormat}`);
    };

    const getStatusBadge = (status: MenuStatus) => {
        return (
            <Badge variant={status === "published" ? "default" : "secondary"}>
                {status === "published" ? "Published" : "Draft"}
            </Badge>
        );
    };

    const renderMenuRow = (menu: WeeklyMenu) => {
        const weekFormat = formatWeekDate(new Date(menu.weekStartDate));
        const menuExists = true; // Menu is passed in, so it exists

        return (
            <TableRow key={menu.id}>
                <TableCell className="font-medium">
                    {formatWeekRange(weekFormat)}
                </TableCell>
                <TableCell>{getStatusBadge(menu.status)}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/menu/view/${weekFormat}`}
                            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}
                        >
                            <Eye className="size-4 mr-1" />
                            View
                        </Link>
                        {menuExists && (
                            <Link
                                href={`/menu/edit/${weekFormat}`}
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}
                            >
                                <Edit className="size-4 mr-1" />
                                Edit
                            </Link>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <section className="flex flex-col gap-10 container max-w-7xl mx-auto py-16 pt-24">
            <div className="space-y-3">
                <h1 className="text-3xl font-semibold">Weekly Menus</h1>
                <p className="text-lg text-muted-foreground">
                    Plan and manage your weekly meal schedules
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Button onClick={handleCreateNextWeek} size="lg">
                    <PlusCircle className="size-4 mr-2" />
                    Create Menu for Next Week
                </Button>

                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="lg">
                            <CalendarIcon className="size-4 mr-2" />
                            Create Menu for Specific Week
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                handleDateSelect(date);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* This Week's Menu */}
            <Card>
                <CardHeader>
                    <CardTitle>This Week</CardTitle>
                    <CardDescription>Menu for the current week</CardDescription>
                </CardHeader>
                <CardContent>
                    {menusByPeriod.thisWeek ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Week Range</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderMenuRow(menusByPeriod.thisWeek)}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="size-12 stroke-1 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-1">No menu for this week</h3>
                            <p className="text-muted-foreground mb-3">
                                Create a menu to get started
                            </p>
                            <Button onClick={handleCreateNextWeek} variant="outline">
                                <PlusCircle className="size-4 mr-2" />
                                Create Menu
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Menus */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Menus</CardTitle>
                    <CardDescription>Future weekly menus</CardDescription>
                </CardHeader>
                <CardContent>
                    {menusByPeriod.upcoming.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Week Range</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menusByPeriod.upcoming.map(renderMenuRow)}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            No upcoming menus
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Past Menus */}
            <Card>
                <CardHeader>
                    <CardTitle>Past Menus</CardTitle>
                    <CardDescription>Previously created menus</CardDescription>
                </CardHeader>
                <CardContent>
                    {menusByPeriod.past.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Week Range</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menusByPeriod.past.slice(0, 10).map(renderMenuRow)}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            No past menus
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
