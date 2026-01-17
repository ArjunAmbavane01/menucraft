import { MenuData, weekdays, weekdayLabels } from "@/types/menu";

export function formatMenuForWhatsApp(
    menuData: MenuData,
    dishesByCategory: Record<string, { id: number; name: string; category: string }[]>
): string {

    const lines: string[] = [];

    weekdays.forEach((day) => {
        const dayData = menuData[day];

        // Add day name
        lines.push(weekdayLabels[day]);

        if (dayData.isHoliday) {
            lines.push("Holiday");
        } else {
            // Get all dishes for this day
            const dishes: string[] = [];

            Object.entries(dayData.dishes).forEach(([category, dishId]) => {
                const categoryDishes = dishesByCategory[category] || [];
                const dish = categoryDishes.find((d) => d.id === dishId);
                if (dish) {
                    dishes.push(dish.name);
                }
            });

            dishes.forEach((dishName) => {
                lines.push(dishName);
            });
        }

        lines.push("");
    });

    if (lines[lines.length - 1] === "") lines.pop();

    return lines.join("\n");
}

export async function copyMenuToClipboard(
    menuData: MenuData,
    dishesByCategory: Record<string, {
        id: number;
        name: string;
        category: string;
    }[]>
): Promise<void> {
    const text = formatMenuForWhatsApp(menuData, dishesByCategory);
    await navigator.clipboard.writeText(text);
}