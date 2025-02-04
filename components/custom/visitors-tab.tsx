import React from "react";
import { Control, UseFormWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteDiaryFormData, UpdateSiteDiaryFormData } from "@/types/schema";
import { VISITOR_TYPES } from "@/constants/options";

export interface VisitorsTabProps {
  control: Control<SiteDiaryFormData | UpdateSiteDiaryFormData>;
  visitorFields: Array<{ id: string }>;
  appendVisitor: (value: SiteDiaryFormData["visitors"][0] | UpdateSiteDiaryFormData["visitors"][0]) => void;
  removeVisitor: (index: number) => void;
  watch: UseFormWatch<SiteDiaryFormData | UpdateSiteDiaryFormData>;
}

const VisitorsTab: React.FC<VisitorsTabProps> = ({ control, visitorFields, appendVisitor, removeVisitor, watch }) => (
  <>
    {visitorFields.map((visitor, index) => (
      <div key={visitor.id} className="space-y-2 border p-2 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FormField
            control={control}
            name={`visitors.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visitor Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VISITOR_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`visitors.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FormField
            control={control}
            name={`visitors.${index}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`visitors.${index}.purpose`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{watch(`visitors.${index}.type`) === "delivery" ? "Items/Quantity" : "Purpose of Visit"}</FormLabel>
                <FormControl>
                  <Input placeholder={watch(`visitors.${index}.type`) === "delivery" ? "Items/Quantity" : "Purpose of Visit"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button variant="destructive" onClick={() => removeVisitor(index)}>
            Delete
          </Button>
        </div>
      </div>
    ))}
    <Button
      variant="outline"
      onClick={() =>
        appendVisitor({
          type: "visitor",
          name: "",
          company: "",
          purpose: "",
        })
      }
      className="w-full"
    >
      Add Record
    </Button>
  </>
);

export default VisitorsTab;
