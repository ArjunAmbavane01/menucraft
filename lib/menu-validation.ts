import { MenuData, Weekday, MenuTemplate } from "@/types/menu";

/**
 * Check if menu is complete (all required slots filled)
 */
export function isMenuComplete(data: MenuData): boolean {
    for (const day of Object.keys(MenuTemplate) as Weekday[]) {
        const dayData = data[day];

        if (dayData?.isHoliday) continue;

        const categoriesForDay = MenuTemplate[day];

        for (const category of categoriesForDay) {
            const dishId = dayData?.dishes?.[category];
            if (!dishId) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Get list of missing slots
 */
export function getMissingSlots(data: MenuData): string[] {
    const missing: string[] = [];

    for (const day of Object.keys(MenuTemplate) as Weekday[]) {
        const dayData = data[day];

        if (dayData?.isHoliday) continue;

        const categoriesForDay = MenuTemplate[day];

        for (const category of categoriesForDay) {
            const dishId = dayData?.dishes?.[category];
            if (!dishId) {
                missing.push(`${day} → ${category}`);
            }
        }
    }

    return missing;
}

