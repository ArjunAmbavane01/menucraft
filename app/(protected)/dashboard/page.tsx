import { getDishLastUsedMap } from '@/server/menu/getDishLastUsedMap';
import { getAllDishesByCategory } from '@/server/menu/menuActions';
import { getMenusByPeriod } from '@/server/menu/getMenusByPeriod';
import Dashboard from '@/components/Dashboard';
import { getAuthenticatedSession } from '@/server/auth/getSession';

export default async function page() {
    await getAuthenticatedSession();
    
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

    return (
        <Dashboard
            menusByPeriod={menusByPeriod}
            dishesByCategory={dishesByCategory}
            lastUsedMap={lastUsedMap}
        />
    )
}
