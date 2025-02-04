"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { RESOURCES_TYPES } from "@/constants/options";
import { useGetSiteDiariesQuery, SiteDiaryData } from "@/lib/queries/site-diary.queries";

import DiaryCard from "@/components/custom/diary-card";
import FilterSheet from "@/components/custom/filter-sheet";
import { format } from "date-fns";
import SiteDiaryFormModal from "@/components/custom/site-diary-form-modal";
import { getSiteName } from "@/lib/common-utils";

interface GroupedDiaries {
  [siteLocation: string]: {
    [date: string]: SiteDiaryData[];
  };
}

export interface FilterState {
  site?: string;
  hasIssues?: boolean;
  resources: string[];
  date?: string;
  search?: string;
}

export default function Page() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    site: undefined,
    hasIssues: undefined,
    resources: [],
    date: new Date().toISOString(),
    search: undefined,
  });
  const [isSiteDiaryFormModalOpen, setIsSiteDiaryFormModalOpen] = useState(false);

  const { data: siteDiaries, isLoading } = useGetSiteDiariesQuery({
    ...filters,
    site: filters.site === "all" ? undefined : filters.site,
    orderBy: "date",
    order: "asc",
  });

  const handleClearFilters = () => {
    setFilters({
      site: undefined,
      hasIssues: undefined,
      resources: [],
      date: new Date().toISOString(),
      search: undefined,
    });
    setIsFilterOpen(false);
  };

  const getFilterCount = () => {
    return [filters.site, filters.hasIssues !== undefined, filters.resources.length > 0, filters.date, filters.search].filter(Boolean).length;
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key]) ? [] : undefined,
    }));
  };

  const groupDiaries = (diaries: SiteDiaryData[] | undefined): GroupedDiaries => {
    if (!diaries) return {};

    return diaries.reduce((acc: GroupedDiaries, diary) => {
      const date = new Date(diary.date).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!acc[diary.siteLocation]) {
        acc[diary.siteLocation] = {};
      }

      if (!acc[diary.siteLocation][date]) {
        acc[diary.siteLocation][date] = [];
      }

      acc[diary.siteLocation][date].push(diary);
      return acc;
    }, {});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const groupedDiaries = groupDiaries(siteDiaries ?? []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Site Diary</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setIsFilterOpen(true)}>
              Filters
              {getFilterCount() > 0 && <Badge variant="secondary">{getFilterCount()}</Badge>}
            </Button>

            <FilterSheet open={isFilterOpen} onOpenChange={setIsFilterOpen} filters={filters} onApplyFilters={setFilters} onClearFilters={handleClearFilters} />

            <Button onClick={() => setIsSiteDiaryFormModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> New
            </Button>
            <SiteDiaryFormModal open={isSiteDiaryFormModalOpen} onClose={() => setIsSiteDiaryFormModalOpen((prev) => !prev)} mode="create" />
          </div>
        </div>

        {/* Applied Filters */}
        {getFilterCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {filters.search}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter("search")} />
              </Badge>
            )}
            {filters.site && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Site: {getSiteName(filters.site)}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter("site")} />
              </Badge>
            )}
            {filters.date && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date: {format(new Date(filters.date), "PPP")}
              </Badge>
            )}
            {filters.hasIssues !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {filters.hasIssues ? "Has Issues" : "On Track"}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter("hasIssues")} />
              </Badge>
            )}
            {filters.resources.map((resource) => (
              <Badge key={resource} variant="secondary" className="flex items-center gap-1">
                {RESOURCES_TYPES.find((r) => r.id === resource)?.label}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      resources: prev.resources.filter((r) => r !== resource),
                    }))
                  }
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {siteDiaries?.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px] text-gray-500 font-medium">Start documenting your site activities.</div>
          ) : (
            Object.entries(groupedDiaries).map(([siteLocation, dateGroups]) => (
              <div key={siteLocation} className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4">{getSiteName(siteLocation)}</h2>

                <div className="space-y-6">
                  {Object.entries(dateGroups).map(([date, diaries]) => (
                    <div key={date}>
                      <h3 className="text-sm font-medium text-secondary-foreground mb-3">{date}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {diaries.map((diary) => (
                          <DiaryCard key={diary.id} diary={diary} getSiteName={getSiteName} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
