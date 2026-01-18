import { Ratelimit } from "@unkey/ratelimit";

export const createMenuLimiter = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  namespace: "menu-create",
  limit: 10,
  duration: "10m",
});

export const updateMenuLimiter = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  namespace: "menu-update",
  limit: 50,
  duration: "5m",
});
