import { MenuData, weekdays } from "@/types/menu";

export function extractDishIds(data: MenuData): number[] {
  const ids = new Set<number>();

  for (const day of weekdays) {
    const dayData = data[day];
    if (!dayData || dayData.isHoliday || !dayData.dishes) continue;
    
    // Extract dish IDs
    if (dayData.dishes) {
      for (const id of Object.values(dayData.dishes)) {
        if (id) ids.add(id);
      }
    }

    // Extract evening snack IDs
    if (dayData.eveningSnacks) {
      for (const id of dayData.eveningSnacks) {
        if (id) ids.add(id);
      }
    }
  }

  return [...ids];
}
