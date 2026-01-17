import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMenuByWeek, getAllDishesByCategory } from "@/server/menu/menuActions";
import { getDishLastUsedMap } from "@/server/menu/getDishLastUsedMap";
import { parseWeekDate } from "@/lib/week-utils";
import EditMenuClient from "./EditMenuClient";
import Navbar from "@/components/navbar/navbar";

interface PageProps {
    params: Promise<{ week: string }>;
}

export default async function EditMenuPage({ params }: PageProps) {
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

    // Get existing menu
    const menu = await getMenuByWeek(week);
    if (!menu) {
        redirect(`/menu/create/${week}`);
    }

    // Fetch dishes and last used map
    const dishesByCategory = await getAllDishesByCategory();
    const lastUsedMap = await getDishLastUsedMap();

    return (
        <>
            <Navbar user={userSession.user} />
            <EditMenuClient
                week={week}
                menu={menu}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
                user={userSession.user}
            />
        </>
    );
}

