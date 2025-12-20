import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronRight, PlusCircle } from "lucide-react";
import { WeeklyMenu } from "@/types/menu";
import { cn } from "@/lib/utils";

interface DashboardProps {
    recentMenus: WeeklyMenu[];
}

export default async function DashboardPage({ recentMenus }: DashboardProps) {
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
                <div className="space-y-3">
                    {recentMenus.map((menu) => (
                        <Link key={menu.id} href={`/menu/${menu.id}`}>
                            <Card className="transition-all hover:shadow-md hover:border-slate-300 cursor-pointer group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                                                <Calendar className="size-5 text-muted-foreground stroke-1 mb-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold">
                                                    Week of {formatDate(menu.weekStartDate)}
                                                </CardTitle>
                                                <p className="text-sm text-slate-500 mt-0.5">
                                                    {getWeekRange(menu.weekStartDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

// Helper function to format date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

// Helper function to get week range
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