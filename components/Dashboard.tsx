"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteMenu } from "@/server/menu/deleteMenu";
import { WeeklyMenu } from "@/types/menu";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar, ChevronRight, PlusCircle, Trash } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useState } from "react";

interface DashboardProps {
    recentMenus: WeeklyMenu[];
}

export default function DashboardPage({ recentMenus }: DashboardProps) {

    const [menus, setMenus] = useState<WeeklyMenu[]>(recentMenus);
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

            <Link href="/create-menu" className={cn(buttonVariants({ size: "lg" }), "flex w-fit")}>
                <PlusCircle className="size-4" />
                Create Weekly Menu
            </Link>

            {/* Menus List */}
            {menus.length === 0 ? (
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
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            onClick={() => router.push(`/menu/${menu.id}`)}
                            className="flex flex-col gap-8 w-100 h-fit p-5 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex w-full gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="text-lg font-medium mb-1.5">
                                        Week of {formatDate(menu.weekStartDate)}
                                    </div>
                                    <p className="text-sm font-normal text-gray-600">
                                        {getWeekRange(menu.weekStartDate)}
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size={"icon"}
                                            variant={"secondary"}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this weekly menu?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action is permanent and cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        await deleteMenu(menu.id);
                                                        setMenus(c => c.filter(m => m.id !== menu.id))
                                                        toast.success("Menu deleted.");
                                                    } catch (error: any) {
                                                        toast.error(error.message);
                                                    }
                                                }}
                                            >
                                                <MdDelete />
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 font-medium">View Details</span>
                                <ChevronRight className="size-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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