import { format, parse, startOfWeek, addDays, addWeeks, differenceInWeeks, isSameWeek, isPast, isFuture } from "date-fns";

/**
 * Format a date as dd-mm-yyyy (week start date format for URLs)
 */
export function formatWeekDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd-MM-yyyy");
}

/**
 * Parse dd-mm-yyyy format to Date
 */
export function parseWeekDate(dateString: string): Date {
  return parse(dateString, "dd-MM-yyyy", new Date());
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
 * Format week range as "DD MMM - DD MMM YYYY"
 */
export function formatWeekRange(weekStartDate: Date | string): string {
  const start = typeof weekStartDate === "string" ? new Date(weekStartDate) : weekStartDate;
  const end = getWeekEnd(start);
  
  const startFormatted = format(start, "dd MMM");
  const endFormatted = format(end, "dd MMM yyyy");
  
  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Check if a date is in the past (before this week)
 */
export function isPastWeek(weekStartDate: Date | string): boolean {
  const date = typeof weekStartDate === "string" ? new Date(weekStartDate) : weekStartDate;
  const thisWeekStart = getWeekStart();
  return date < thisWeekStart;
}

/**
 * Check if a date is in the future (after this week)
 */
export function isFutureWeek(weekStartDate: Date | string): boolean {
  const date = typeof weekStartDate === "string" ? new Date(weekStartDate) : weekStartDate;
  const thisWeekStart = getWeekStart();
  const thisWeekEnd = getWeekEnd();
  return date > thisWeekEnd;
}

/**
 * Check if a date is this week
 */
export function isThisWeek(weekStartDate: Date | string): boolean {
  const date = typeof weekStartDate === "string" ? new Date(weekStartDate) : weekStartDate;
  return isSameWeek(date, new Date(), { weekStartsOn: 1 });
}

/**
 * Convert a date string (YYYY-MM-DD) to week format (dd-mm-yyyy)
 */
export function dateStringToWeekFormat(dateString: string): string {
  return formatWeekDate(new Date(dateString));
}

/**
 * Convert week format (dd-mm-yyyy) to date string (YYYY-MM-DD)
 */
export function weekFormatToDateString(weekFormat: string): string {
  const date = parseWeekDate(weekFormat);
  return format(date, "yyyy-MM-dd");
}

