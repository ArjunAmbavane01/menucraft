import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createWeeklyMenu } from '@/server/menu/createWeeklyMenu';
import CreateMenuPage from '@/components/create-menu/create-menu-page';

export default async function page() {
  const userSession = await auth.api.getSession({
    headers: await headers()
  })
  if (!userSession) redirect("/signin");

  // Fetch recent menus
  const { menu, dishesByCategory } = await createWeeklyMenu();

  return (
    <>
      <CreateMenuPage menu={menu} dishesByCategory={dishesByCategory} />
    </>
  )
}
