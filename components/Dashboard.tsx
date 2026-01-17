"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { WeeklyMenu, MenuStatus } from "@/types/menu";
import { formatWeekRange, formatWeekDate, getNextWeekStart } from "@/lib/week-utils";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CalendarIcon, PlusCircle, Edit, Eye, Check, Link as UrlLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenuTable } from "@/components/menu/MenuTable";
import { toast } from "sonner";
import { Separator } from "./ui/separator";

interface DashboardProps {
    menusByPeriod: {
        thisWeek: WeeklyMenu | null;
        upcoming: WeeklyMenu[];
        past: WeeklyMenu[];
    };
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]> | null;
    lastUsedMap: Record<number, string | null> | null;
}

export default function DashboardPage({
    menusByPeriod,
    dishesByCategory,
    lastUsedMap
}: DashboardProps) {
    const router = useRouter();

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [copiedId, setCopiedId] = useState<number | null>(null);

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

    const handleCopyLink = async (menu: WeeklyMenu) => {
        const weekFormat = formatWeekDate(new Date(menu.weekStartDate));
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
        const url = `${baseUrl}/menu/view/${weekFormat}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(menu.id);
            toast.success("Menu link copied");

            // Reset icon after 2 seconds
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const renderMenuRow = (menu: WeeklyMenu) => {
        const weekFormat = formatWeekDate(new Date(menu.weekStartDate));
        const menuExists = true; // Menu is passed in, so it exists
        const isPublished = menu.status === "published";
        const isCopied = copiedId === menu.id;

        return (
            <TableRow key={menu.id}>
                <TableCell className="font-medium">
                    {formatWeekRange(weekFormat)}
                </TableCell>
                <TableCell>{getStatusBadge(menu.status)}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <Link
                                            href={`/menu/view/${weekFormat}`}
                                            aria-disabled={!isPublished}
                                            className={cn(
                                                buttonVariants({ variant: "outline", size: "sm" }),
                                                "h-8",
                                                !isPublished && "pointer-events-none opacity-50"
                                            )}
                                        >
                                            <Eye className="size-4 mr-1" />
                                            View
                                        </Link>
                                    </span>

                                </TooltipTrigger>
                                {!isPublished && (
                                    <TooltipContent>
                                        <p>Publish to view the menu</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                        {menuExists && (
                            <Link
                                href={`/menu/edit/${weekFormat}`}
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}
                            >
                                <Edit className="size-4 mr-1" />
                                Edit
                            </Link>
                        )}
                        {isPublished && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>

                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            onClick={() => handleCopyLink(menu)}
                                            className="transition-all"
                                        >
                                            {isCopied ? <Check className="text-green-500" /> : <UrlLink />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Copy menu link</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <section className="flex flex-col gap-10 container max-w-7xl mx-auto py-16 pt-24">
            <div className="space-y-2">
                <h1 className="text-2xl font-medium">Weekly Menus</h1>
                <p className="text-muted-foreground">
                    Plan and manage your weekly meal schedules
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Button onClick={handleCreateNextWeek} size="lg">
                    <PlusCircle />
                    Create Menu for Next Week
                </Button>

                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="lg">
                            <CalendarIcon />
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
            {menusByPeriod.thisWeek ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-normal tracking-tight">This Week's Menu</h2>
                            <p className="text-muted-foreground mt-1">
                                {formatWeekRange(formatWeekDate(new Date(menusByPeriod.thisWeek.weekStartDate)))}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm ${menusByPeriod.thisWeek.status === "published"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                                }`}>
                                <span className={`h-2 w-2 rounded-full ${menusByPeriod.thisWeek.status === "published"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                    }`} />
                                <span className="font-medium">
                                    {menusByPeriod.thisWeek.status === "published" ? "Published" : "Draft"}
                                </span>
                            </div>
                            <Link
                                href={`/menu/edit/${formatWeekDate(new Date(menusByPeriod.thisWeek.weekStartDate))}`}
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                            >
                                <Edit className="size-4 mr-1" />
                                Edit
                            </Link>
                            {menusByPeriod.thisWeek.status === "published" && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyLink(menusByPeriod.thisWeek!)}
                                            >
                                                {copiedId === menusByPeriod.thisWeek.id ? (
                                                    <Check className="size-4 text-green-500" />
                                                ) : (
                                                    <UrlLink className="size-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Copy menu link</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    <MenuTable
                        menu={{
                            id: menusByPeriod.thisWeek.id,
                            weekStartDate: menusByPeriod.thisWeek.weekStartDate,
                            data: menusByPeriod.thisWeek.data,
                            status: menusByPeriod.thisWeek.status
                        }}
                        dishesByCategory={dishesByCategory!}
                        lastUsedMap={lastUsedMap!}
                        onDishChange={() => { }}
                        onToggleHoliday={() => { }}
                        readOnly
                    />
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="size-12 stroke-1 text-muted-foreground/40 mb-4" />
                            <h3 className="text-lg font-semibold">No menu for this week</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Create a menu to get started
                            </p>
                            <Button onClick={handleCreateNextWeek} size="lg">
                                <PlusCircle />
                                Create Menu
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Separator />

            {/* Upcoming Menus */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-normal tracking-tight">Upcoming</h2>
                    <p className="text-muted-foreground mt-1">
                        Future weekly menus
                    </p>
                </div>

                {menusByPeriod.upcoming.length > 0 ? (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="font-semibold">Week Range</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...menusByPeriod.upcoming]
                                    .sort((a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime())
                                    .map(renderMenuRow)}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No upcoming menus
                        </p>
                    </div>
                )}
            </div>

            <Separator />

            {/* Past Menus */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-normal tracking-tight">Past Menus</h2>
                    <p className="text-muted-foreground mt-1">
                        Previously created menus
                    </p>
                </div>

                {menusByPeriod.past.length > 0 ? (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="font-semibold">Week Range</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...menusByPeriod.past]
                                    .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime())
                                    .slice(0, 10)
                                    .map(renderMenuRow)}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No past menus
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
