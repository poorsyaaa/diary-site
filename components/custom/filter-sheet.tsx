import { useState } from "react";
import { FilterState } from "@/app/page";
import { Search } from "lucide-react";
import { SITE_OPTIONS, RESOURCES_TYPES } from "@/constants/options";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import DatePicker from "./date-picker";
import { cn } from "@/lib/utils";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ open, onOpenChange, filters, onApplyFilters, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleLocalClearFilters = () => {
    setLocalFilters({
      site: undefined,
      hasIssues: undefined,
      resources: [],
      date: new Date().toISOString(),
      search: undefined,
    });
    onClearFilters();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFilters(filters);
    }
    onOpenChange(isOpen);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className={isDesktop ? "max-w-md" : "w-full"}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <Button variant="ghost" size="sm" onClick={handleLocalClearFilters} className="h-8 px-2 text-sm">
              Clear all
            </Button>
          </div>
        </SheetHeader>
        <div className={cn("mt-6 space-y-6", !isDesktop && "pb-20")}>
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phase or description..."
                className="pl-9"
                value={localFilters.search ?? ""}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {/* Site Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Site</Label>
            <div className={cn("grid gap-2", isDesktop ? "grid-cols-2" : "grid-cols-1")}>
              <Button
                variant={!localFilters.site ? "default" : "outline"}
                onClick={() => setLocalFilters((prev) => ({ ...prev, site: undefined }))}
                className="h-9"
              >
                All Sites
              </Button>
              {SITE_OPTIONS.map((site) => (
                <Button
                  key={site.id}
                  variant={localFilters.site === site.id ? "default" : "outline"}
                  onClick={() => setLocalFilters((prev) => ({ ...prev, site: site.id }))}
                  className="h-9"
                >
                  {site.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <DatePicker value={localFilters.date} onChange={(date) => setLocalFilters((prev) => ({ ...prev, date }))} isModal />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {[true, false].map((status) => (
                <Button
                  key={String(status)}
                  variant={localFilters.hasIssues === status ? "default" : "outline"}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      hasIssues: prev.hasIssues === status ? undefined : status,
                    }))
                  }
                  className="h-9"
                >
                  {status ? "Has Issues" : "On Track"}
                </Button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Resources</Label>
            <div className={cn("gap-2", isDesktop ? "flex flex-wrap" : "grid grid-cols-2")}>
              {RESOURCES_TYPES.map(({ id, label }) => (
                <Button
                  key={id}
                  variant={localFilters.resources.includes(id) ? "default" : "outline"}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      resources: prev.resources.includes(id) ? prev.resources.filter((r) => r !== id) : [...prev.resources, id],
                    }));
                  }}
                  className="h-9"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleApply} className={cn("h-9", !isDesktop && "w-full")}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
