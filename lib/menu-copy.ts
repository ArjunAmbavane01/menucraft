import { DishesByCategory } from "@/types/dishes";
import { MenuData, weekdays, weekdayLabels, MenuTemplate } from "@/types/menu";

export function formatMenuForWhatsApp(
    menuData: MenuData,
    dishesByCategory: DishesByCategory
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

            const orderedCategories = [...MenuTemplate[day]];

            // reorder special to be at index 2 if there
            const specialIndex = orderedCategories.indexOf("special");
            if (specialIndex !== -1) {
                orderedCategories.splice(specialIndex, 1);
                orderedCategories.splice(2, 0, "special");
            }

            orderedCategories.forEach((category) => {
                const dishId = dayData.dishes[category];
                if (!dishId) return;

                const categoryDishes = dishesByCategory[category] || [];
                const dish = categoryDishes.find((d) => d.id === dishId);

                if (dish) dishes.push(dish.name);
            });

            dishes.forEach((dishName) => {
                lines.push(dishName);
            });
        }

        // Evening snacks
        if (dayData.eveningSnacks?.length) {
            const snackNames = dayData.eveningSnacks
                .map((id) =>
                    (dishesByCategory["snack"] || []).find((d) => d.id === id)?.name
                )
                .filter(Boolean);

            if (snackNames.length) {
                lines.push(`Eve snacks - ${snackNames.join(", ")}`);
            }
        }

        lines.push("");
    });

    if (lines[lines.length - 1] === "") lines.pop();

    return lines.join("\n");
}

export async function copyMenuToClipboard(
    menuData: MenuData,
    dishesByCategory: DishesByCategory
): Promise<void> {
    const text = formatMenuForWhatsApp(menuData, dishesByCategory);
    await navigator.clipboard.writeText(text);
}