import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SiteDiaryFormData, UpdateSiteDiaryFormData } from "@/types/schema";

export interface ProgressTabProps {
  control: Control<SiteDiaryFormData | UpdateSiteDiaryFormData>;
  hasDelaysOrIssues: boolean;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ control, hasDelaysOrIssues }) => (
  <>
    <FormField
      control={control}
      name="currentPhase"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Current Phase</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter current phase" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="workCompleted"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Work Completed</FormLabel>
          <FormControl>
            <Textarea placeholder="Detail today's construction activities and progress..." rows={4} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="hasDelaysOrIssues"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-3">
          <FormLabel className="mb-0">Any delays or issues?</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    {hasDelaysOrIssues && (
      <FormField
        control={control}
        name="delaysOrIssues"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Delays or Issues</FormLabel>
            <FormControl>
              <Textarea placeholder="Note any delays, issues, or incidents..." rows={2} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )}
  </>
);

export default ProgressTab;
