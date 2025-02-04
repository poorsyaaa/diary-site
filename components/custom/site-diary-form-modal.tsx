"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";

import GlobalFields from "@/components/custom/global-fields";
import ProgressTab from "@/components/custom/progress-tab";
import ResourcesTab from "@/components/custom/resources-tab";
import VisitorsTab from "@/components/custom/visitors-tab";
import SitePhotos from "@/components/custom/site-photos";
import { formSchema, SiteDiaryFormData, updateFormSchema, UpdateSiteDiaryFormData } from "@/types/schema";
import { useSaveSiteDiaryMutation, useUpdateSiteDiaryMutation } from "@/lib/mutation/site-diary.mutation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CustomModal,
  CustomModalBody,
  CustomModalContent,
  CustomModalDescription,
  CustomModalHeader,
  CustomModalTitle,
} from "@/components/custom/custom-modal";
import { useQueryClient } from "@tanstack/react-query";

interface SiteDiaryFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: UpdateSiteDiaryFormData;
  mode?: "create" | "update";
}

const SiteDiaryFormModal: React.FC<SiteDiaryFormModalProps> = ({ open = false, onClose, initialData, mode = "create" }) => {
  const isUpdateMode = mode === "update";
  const schema = isUpdateMode ? updateFormSchema : formSchema;

  const form = useForm<SiteDiaryFormData | UpdateSiteDiaryFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      date: "",
      siteLocation: "site-1",
      weather: "sunny",
      description: "",
      currentPhase: "",
      workCompleted: "",
      hasDelaysOrIssues: false,
      delaysOrIssues: "",
      labor: "",
      equipment: "",
      materials: "",
      visitors: [],
      images: [],
    },
  });

  const queryClient = useQueryClient();

  const [hasSelectedFiles, setHasSelectedFiles] = useState(false);

  const { mutateAsync: saveSiteDiary, isPending: isCreatePending } = useSaveSiteDiaryMutation();
  const { mutateAsync: updateSiteDiary, isPending: isUpdatePending } = useUpdateSiteDiaryMutation();

  const { handleSubmit, control, watch, formState, reset } = form;
  const { errors } = formState;

  const {
    fields: visitorFields,
    append: appendVisitor,
    remove: removeVisitor,
  } = useFieldArray({
    control,
    name: "visitors",
  });

  const hasDelaysOrIssuesValue = watch("hasDelaysOrIssues");
  const progressHasError = !!errors.currentPhase || (hasDelaysOrIssuesValue && !!errors.delaysOrIssues);
  const resourcesHasError = !!errors.labor || !!errors.equipment || !!errors.materials;
  const visitorsHasError = !!errors.visitors;

  const onSubmit = async (data: SiteDiaryFormData | UpdateSiteDiaryFormData) => {
    if (hasSelectedFiles) {
      toast.warning("IMAGE_UPLOAD_WARNING", {
        description: "You've selected images, but you haven't uploaded them yet. Please upload them before submitting.",
      });

      return;
    }

    const commonMutationOptions = {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["site-diaries"],
        });
      },
      onSettled: () => {
        reset();
        onClose();
      },
    };

    if (isUpdateMode) {
      if (!("id" in data)) {
        toast.error("UPDATE_ERROR", {
          description: "Missing ID for update operation",
        });
        return;
      }
      await updateSiteDiary(data, commonMutationOptions);
    } else {
      await saveSiteDiary(data, commonMutationOptions);
    }
  };

  return (
    <CustomModal open={open} onOpenChange={onClose}>
      <CustomModalContent>
        <CustomModalHeader>
          <CustomModalTitle>Site Diary</CustomModalTitle>
          <CustomModalDescription>{isUpdateMode ? "Update existing site diary entry." : "Add a new site diary entry."}</CustomModalDescription>
        </CustomModalHeader>
        <CustomModalBody className="space-y-4 pb-4 text-sm sm:text-left">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Global Fields */}
              <GlobalFields control={control} isUpdateMode={isUpdateMode} />

              {/* Tabs */}
              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="progress">
                    Progress
                    {progressHasError && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full" />}
                  </TabsTrigger>
                  <TabsTrigger value="resources">
                    Resources
                    {resourcesHasError && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full" />}
                  </TabsTrigger>
                  <TabsTrigger value="visitors">
                    Site Records
                    {visitorsHasError && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full" />}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="progress" className="space-y-4">
                  <ProgressTab control={control} hasDelaysOrIssues={hasDelaysOrIssuesValue} />
                </TabsContent>
                <TabsContent value="resources" className="space-y-4">
                  <ResourcesTab control={control} />
                </TabsContent>
                <TabsContent value="visitors" className="space-y-4">
                  <VisitorsTab control={control} visitorFields={visitorFields} appendVisitor={appendVisitor} removeVisitor={removeVisitor} watch={watch} />
                </TabsContent>
              </Tabs>

              {/* Site Photos */}
              <SitePhotos control={control} setHasSelectedFiles={setHasSelectedFiles} />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isCreatePending || isUpdatePending}>
                {isCreatePending || isUpdatePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    {isUpdateMode ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>{isUpdateMode ? "Update Site Diary Entry" : "Submit Site Diary Entry"}</>
                )}
              </Button>
            </form>
          </Form>
        </CustomModalBody>
      </CustomModalContent>
    </CustomModal>
  );
};

export default SiteDiaryFormModal;
