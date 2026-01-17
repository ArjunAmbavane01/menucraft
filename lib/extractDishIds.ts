import { MenuData, weekdays } from "@/types/menu";

export function extractDishIds(data: MenuData): number[] {
  const ids = new Set<number>();

  for (const day of weekdays) {
    const dayData = data[day];
    if (!dayData || dayData.isHoliday || !dayData.dishes) continue;

    for (const id of Object.values(dayData.dishes)) {
      if (id) ids.add(id);
    }
  }

  return [...ids];
}
