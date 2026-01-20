import { redirect } from "next/navigation";
import { getAllDishesByCategory } from "@/server/menu/menuActions";
import { getDishLastUsedMap } from "@/server/menu/getDishLastUsedMap";
import { parseWeekDate, weekToISODate } from "@/lib/week-utils";
import CreateMenuClient from "./CreateMenuClient";
import { getAuthenticatedSession } from "@/server/auth/getSession";

interface PageProps {
    params: Promise<{ week: string }>;
}

export default async function CreateMenuPage({ params }: PageProps) {
    await getAuthenticatedSession();
    const { week } = await params;

    // Validate week format
    try {
        parseWeekDate(week);
    } catch {
        redirect("/dashboard");
    }

    // Fetch dishes and last used map
    const [dishesByCategory, lastUsedMap] = await Promise.all([
        getAllDishesByCategory(),
        getDishLastUsedMap(weekToISODate(week))
    ]);

    return (
        <CreateMenuClient
            week={week}
            dishesByCategory={dishesByCategory}
            lastUsedMap={lastUsedMap}
        />
    );
}

