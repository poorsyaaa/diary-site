import { SITE_OPTIONS } from "@/constants/options";

export const getSiteName = (siteId: string) => SITE_OPTIONS.find((site) => site.id === siteId)?.name ?? siteId;
