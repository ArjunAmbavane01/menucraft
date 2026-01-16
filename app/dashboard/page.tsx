import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
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

    return (
        <>
            <Navbar user={userSession.user} />
            <Dashboard menusByPeriod={menusByPeriod} />
        </>
    )
}
