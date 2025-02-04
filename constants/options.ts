import { Cloud, Users, HardHat, Wrench, Hammer, Camera } from "lucide-react";

export const SITE_OPTIONS = [
  { id: "site-1", name: "Main Construction Site", lat: -33.8688, lon: 151.2093 }, // Sydney, Australia
  { id: "site-2", name: "Philippines HQ", lat: 14.5995, lon: 120.9842 }, // Manila, Philippines
  { id: "site-3", name: "Melbourne VIC Office", lat: -37.8136, lon: 144.9631 }, // Melbourne, VIC
] as const;

export const WEATHER_OPTIONS = [
  { id: "sunny", name: "Sunny" },
  { id: "partly-cloudy", name: "Partly Cloudy" },
  { id: "overcast", name: "Overcast" },
  { id: "rainy", name: "Rainy" },
  { id: "stormy", name: "Stormy" },
] as const;

export const WEATHER_ICONS: Record<string, string> = {
  sunny: "☀️",
  "partly-cloudy": "⛅",
  overcast: "☁️",
  rainy: "🌧️",
  stormy: "⛈️",
} as const;

export const RESOURCES_TYPES = [
  { id: "weather", icon: Cloud, label: "Weather" },
  { id: "visitors", icon: Users, label: "Visitors" },
  { id: "labor", icon: HardHat, label: "Labor" },
  { id: "equipment", icon: Wrench, label: "Equipment" },
  { id: "materials", icon: Hammer, label: "Materials" },
  { id: "photos", icon: Camera, label: "Photos" },
] as const;

export const VISITOR_TYPES = {
  visitor: "Site Visitor",
  inspection: "Inspector",
  delivery: "Delivery",
} as const;
