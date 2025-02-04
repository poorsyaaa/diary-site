import { queryOptions, useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../api-utils";
import { SiteDiaryFilters } from "@/types/schema";

interface Visitor {
  name: string;
  type: "visitor" | "inspection" | "delivery";
  company: string;
  purpose: string;
}

export interface SiteDiaryData {
  id: number;
  date: string;
  siteLocation: string;
  weather: string;
  description: string;
  currentPhase: string;
  workCompleted: string;
  hasDelaysOrIssues: boolean;
  delaysOrIssues: string;
  labor: string;
  equipment: string;
  materials: string;
  visitors: Visitor[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const getSiteDiaries = async (filters: SiteDiaryFilters) => {
  const params = new URLSearchParams();

  if (filters?.site) params.append("site", filters.site);
  if (filters?.phase) params.append("phase", filters.phase);
  if (filters?.hasIssues !== undefined) params.append("hasIssues", String(filters.hasIssues));
  if (filters?.orderBy) params.append("orderBy", filters.orderBy);
  if (filters?.order) params.append("order", filters.order);
  if (filters?.date) params.append("date", filters.date);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.resources?.length) params.append("resources", filters.resources.join(","));

  const response = await fetch(`/api/diary?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return response;
};

export const getSiteDiariesQueryOptions = (filters: SiteDiaryFilters) =>
  queryOptions({
    queryKey: ["site-diaries", filters],
    queryFn: createQueryFn<SiteDiaryData[]>(() => getSiteDiaries(filters)),
  });

export const useGetSiteDiariesQuery = (filters: SiteDiaryFilters) => useQuery(getSiteDiariesQueryOptions(filters));

export const getSiteDiaryById = async (id: number) => {
  const response = await fetch(`/api/diary/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

export const getSiteDiaryByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["site-diary", id],
    queryFn: createQueryFn<SiteDiaryData>(() => getSiteDiaryById(id)),
  });

export const useGetSiteDiaryByIdQuery = (id: number) => useQuery(getSiteDiaryByIdQueryOptions(id));
