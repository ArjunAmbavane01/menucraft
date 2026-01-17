import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMenusByPeriod } from '@/server/menu/getMenusByPeriod';
import { auth } from '@/lib/auth'
import Navbar from '@/components/navbar/navbar';
import Dashboard from '@/components/Dashboard';
import { getAllDishesByCategory } from '@/server/menu/menuActions';
import { getDishLastUsedMap } from '@/server/menu/getDishLastUsedMap';

export default async function page() {
    const userSession = await auth.api.getSession({
        headers: await headers()
    })
    if (!userSession) redirect("/signin");

    // Fetch menus grouped by period
    const menusByPeriod = await getMenusByPeriod();

    // Fetch dishes and last used map
    const dishesByCategoryRaw = await getAllDishesByCategory();
    const lastUsedMap = await getDishLastUsedMap();

    return (
        <>
            <Navbar user={userSession.user} />
            <Dashboard
                menusByPeriod={menusByPeriod}
                dishesByCategory={dishesByCategoryRaw}
                lastUsedMap={lastUsedMap}
            />
        </>
    )
}
