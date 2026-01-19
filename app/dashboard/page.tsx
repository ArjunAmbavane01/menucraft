import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDishLastUsedMap } from '@/server/menu/getDishLastUsedMap';
import { getAllDishesByCategory } from '@/server/menu/menuActions';
import { getMenusByPeriod } from '@/server/menu/getMenusByPeriod';
import { auth } from '@/lib/auth'
import Navbar from '@/components/navbar/navbar';
import Dashboard from '@/components/Dashboard';

export default async function page() {
    const userSession = await auth.api.getSession({
        headers: await headers()
    })
    if (!userSession) redirect("/signin");

    // Fetch menus grouped by period
    const menusByPeriod = await getMenusByPeriod();
    const thisWeekMenu = menusByPeriod.thisWeek;

    let dishesByCategory = null;
    let lastUsedMap = null;

    if (thisWeekMenu) {
        // Fetch dishes and last used map
        [dishesByCategory, lastUsedMap] = await Promise.all([
            getAllDishesByCategory(),
            getDishLastUsedMap(thisWeekMenu.weekStartDate)
        ]);
    }
    console.log("heap MB", Math.round(process.memoryUsage().heapUsed / 1024 / 1024));

    return (
        <>
            <Navbar user={userSession.user} />
            <Dashboard
                menusByPeriod={menusByPeriod}
                dishesByCategory={dishesByCategory}
                lastUsedMap={lastUsedMap}
            />
        </>
    )
}
