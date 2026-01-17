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

    // Check if menu already exists
    const existingMenu = await getMenuByWeek(week);
    if (existingMenu) redirect(`/menu/edit/${week}`);

    // Fetch dishes and last used map
    const dishesByCategory = await getAllDishesByCategory();
    const lastUsedMap = await getDishLastUsedMap(new Date(weekToISODate(week)));

    return (
        <>
            <Navbar user={userSession.user} />
            <CreateMenuClient
                week={week}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                user={userSession.user}
            />
        </>
    );
}

