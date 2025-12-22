"use client"

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronRight, PlusCircle } from "lucide-react";
import { WeeklyMenu } from "@/types/menu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteMenu } from "@/server/menu/deleteMenu";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DashboardProps {
    recentMenus: WeeklyMenu[];
}

export default function DashboardPage({ recentMenus }: DashboardProps) {
    const router = useRouter();
    return (
        <section className="flex flex-col gap-10 top-16 container h-screen max-w-7xl mx-auto py-30">
            <div className="space-y-3">
                <h1 className="text-3xl">
                    Weekly Menus
                </h1>
                <p className="text-lg text-muted-foreground">
                    Plan and manage your weekly meal schedules
                </p>
            </div>

            <Link href="/create-menu" className={cn(buttonVariants({ size: "lg" }), "flex items-center! w-fit")}>
                <PlusCircle className="size-4" />
                Create Weekly Menu
            </Link>

            {/* Menus List */}
            {recentMenus.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Calendar className="size-12 text-muted-foreground stroke-1 mb-5" />
                        <h3 className="text-lg font-semibold mb-3">
                            No menus yet
                        </h3>
                        <p className="text-muted-foreground text-center">
                            Get started by creating your first weekly menu
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentMenus.map((menu) => (
                        <div key={menu.id} className="relative group">

                            {/* Delete confirmation dialog */}
                            <AlertDialog>
                                {/* Trigger Button */}
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size={"icon"}
                                        variant={"ghost"}
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-3 right-3 z-10 p-2 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash className="size-4 text-red-600" />
                                    </Button>
                                </AlertDialogTrigger>

                                {/* Dialog Content */}
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this weekly menu?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action is permanent and cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    await deleteMenu(menu.id);
                                                    toast.success("Menu deleted.");
                                                    router.refresh();
                                                } catch (error: any) {
                                                    toast.error(error.message);
                                                }
                                            }}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Card link */}
                            <Link href={`/menu/${menu.id}`}>
                                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-slate-200">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-blue-100 border rounded-lg shadow-md">
                                                <Calendar className="size-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                                                    Week of {formatDate(menu.weekStartDate)}
                                                </CardTitle>
                                                <p className="text-sm font-medium text-slate-600">
                                                    {getWeekRange(menu.weekStartDate)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0 pb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 font-medium">View Details</span>
                                            <ChevronRight className="size-5 text-blue-500 group-hover:translate-x-2 transition-transform duration-300" />
                                        </div>
                                    </CardContent>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function getWeekRange(startDateString: string): string {
    const startDate = new Date(startDateString);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const startFormatted = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const endFormatted = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return `${startFormatted} - ${endFormatted}`;
}