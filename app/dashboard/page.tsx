import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRecentMenus } from '@/server/menu/getRecentMenus';
import { auth } from '@/lib/auth'
import Navbar from '@/components/navbar/navbar';
import Dashboard from '@/components/Dashboard';

export default async function page() {
    const userSession = await auth.api.getSession({
        headers: await headers()
    })
    if (!userSession) redirect("/signin");

    // Fetch recent menus
    const recentMenus = await getRecentMenus();

    return (
        <>
            <Navbar user={userSession.user} />
            <Dashboard recentMenus={recentMenus} />
        </>
    )
}
