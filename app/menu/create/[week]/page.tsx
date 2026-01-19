import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMenuByWeek, getAllDishesByCategory } from "@/server/menu/menuActions";
import { getDishLastUsedMap } from "@/server/menu/getDishLastUsedMap";
import { parseWeekDate, weekToISODate } from "@/lib/week-utils";
import CreateMenuClient from "./CreateMenuClient";
import Navbar from "@/components/navbar/navbar";

interface PageProps {
    params: Promise<{ week: string }>;
}

export default async function CreateMenuPage({ params }: PageProps) {
    const userSession = await auth.api.getSession({
        headers: await headers(),
    });

    if (!userSession) redirect("/signin");

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
        <>
            <Navbar user={userSession.user} />
            <CreateMenuClient
                week={week}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
            />
        </>
    );
}

