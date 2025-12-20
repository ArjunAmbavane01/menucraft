import { pgTable, serial, text, date, jsonb } from "drizzle-orm/pg-core";

export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
});

export const weeklyMenus = pgTable("weekly_menus", {
  id: serial("id").primaryKey(),
  weekStartDate: date("week_start_date").notNull(),
  data: jsonb("data").notNull(),
});
