export const STORAGE_KEYS = {
  GUEST_CART_ID: "guest_cart_id",
  GUEST_CART_ITEMS: "guest_cart_items",
  THEME: "theme",
} as const;

export const CART_CONFIG = {
  GUEST_ID_PREFIX: "guest",
  USER_ID_PREFIX: "user",
  STALE_TIME: 1000 * 60 * 5,
  GC_TIME: 1000 * 60 * 30,
} as const;
