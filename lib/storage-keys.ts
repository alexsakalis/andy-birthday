import { siteConfig } from "@/config/site";

export const STORAGE_KEY = siteConfig.storageKey;
export const STORAGE_VERSION = siteConfig.storageVersion;
export const BIRTHDAY_CELEBRATED_KEY = `${STORAGE_KEY}:birthday-celebrated`;
