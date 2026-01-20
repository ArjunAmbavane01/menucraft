import { redirect } from "next/navigation";
import { getMenuByWeek, getAllDishesByCategory } from "@/server/menu/menuActions";
import { getDishLastUsedMap } from "@/server/menu/getDishLastUsedMap";
import { parseWeekDate, weekToISODate } from "@/lib/week-utils";
import EditMenuClient from "./EditMenuClient";
import { toast } from "sonner";
import { getAuthenticatedSession } from "@/server/auth/getSession";

interface PageProps {
    params: Promise<{ week: string }>;
}

export default async function EditMenuPage({ params }: PageProps) {
    await getAuthenticatedSession();

    const { week } = await params;

    // Validate week format
    try {
        parseWeekDate(week);
    } catch {
        redirect("/dashboard");
    }

    // Get existing menu
    const menu = await getMenuByWeek(week);
    if (!menu) {
        toast.error("The requested menu could not be found.");
        redirect(`/dashboard`);
    }

    // Fetch dishes and last used map
    const [dishesByCategory, lastUsedMap] = await Promise.all([
        getAllDishesByCategory(),
        getDishLastUsedMap(weekToISODate(week))
    ]);

    return (
        <EditMenuClient
            week={week}
            menu={menu}
            dishesByCategory={dishesByCategory}
            lastUsedMap={lastUsedMap}
        />
    );
}

