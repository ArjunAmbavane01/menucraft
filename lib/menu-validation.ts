import { MenuData, Weekday, MenuTemplate } from "@/types/menu";

/**
 * Check if menu is complete
 */
export function isMenuComplete(data: MenuData): boolean {
    for (const day of Object.keys(MenuTemplate) as Weekday[]) {
        const dayData = data[day];
        if (dayData?.isHoliday) continue;

        // Check if at least one dish exists
        const hasDishes = Object.keys(dayData?.dishes || {}).length > 0;
        if (!hasDishes) return false;
    }

    return true;
}
