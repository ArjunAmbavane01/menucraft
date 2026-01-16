import { format, parse, startOfWeek, addDays, addWeeks, differenceInWeeks, isSameWeek, isPast, isFuture, isValid } from "date-fns";

/**
 * Parse dd-mm-yyyy format to Date
 * This is the single source of truth for parsing week date strings.
 * Never use new Date(string) for week strings - always use this function.
 */
export function parseWeekDate(week: string): Date {
  const parsed = parse(week, "dd-MM-yyyy", new Date());
  if (!isValid(parsed)) {
    throw new Error(`Invalid week date format: ${week}. Expected dd-mm-yyyy`);
  }
  return parsed;
}

/**
 * Format a Date object as dd-mm-yyyy (week start date format for URLs)
 * Only accepts Date objects - use parseWeekDate() first if you have a week string.
 */
export function formatWeekDate(date: Date): string {
  return format(date, "dd-MM-yyyy");
}

/**
 * Format week range as "DD MMM - DD MMM YYYY"
 * Accepts week string in dd-mm-yyyy format (from URLs)
 */
export function formatWeekRange(week: string): string {
  const start = parseWeekDate(week);
  const end = getWeekEnd(start);

  const startFormatted = format(start, "dd MMM");
  const endFormatted = format(end, "dd MMM yyyy");

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Convert week format (dd-mm-yyyy) to ISO date string (YYYY-MM-DD)
 * Used for database storage where weekStartDate is stored as YYYY-MM-DD
 */
export function weekToISODate(week: string): string {
  const date = parseWeekDate(week);
  return format(date, "yyyy-MM-dd");
}

/**
 * Get the Monday of the week for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Get the Sunday of the week for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const start = getWeekStart(date);
  return addDays(start, 6);
}

/**
 * Get the next week's start date (Monday)
 */
export function getNextWeekStart(): Date {
  return addWeeks(getWeekStart(), 1);
}

/**
 * Check if a week (dd-mm-yyyy format) is in the past (before this week)
 */
export function isPastWeek(week: string): boolean {
  const date = parseWeekDate(week);
  const thisWeekStart = getWeekStart();
  return date < thisWeekStart;
}

/**
 * Check if a week (dd-mm-yyyy format) is in the future (after this week)
 */
export function isFutureWeek(week: string): boolean {
  const date = parseWeekDate(week);
  const thisWeekStart = getWeekStart();
  const thisWeekEnd = getWeekEnd();
  return date > thisWeekEnd;
}

/**
 * Check if a week (dd-mm-yyyy format) is this week
 */
export function isThisWeek(week: string): boolean {
  const date = parseWeekDate(week);
  return isSameWeek(date, new Date(), { weekStartsOn: 1 });
}