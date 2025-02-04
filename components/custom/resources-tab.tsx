import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SiteDiaryFormData, UpdateSiteDiaryFormData } from "@/types/schema";

export interface ResourcesTabProps {
  control: Control<SiteDiaryFormData | UpdateSiteDiaryFormData>;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ control }) => (
  <>
    <FormField
      control={control}
      name="labor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Labor</FormLabel>
          <FormControl>
            <Textarea placeholder="List workers on site and hours worked..." rows={2} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="equipment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Equipment</FormLabel>
          <FormControl>
            <Textarea placeholder="List equipment used and duration..." rows={2} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="materials"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Materials</FormLabel>
          <FormControl>
            <Textarea placeholder="List materials used in today's work..." rows={2} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default ResourcesTab;
