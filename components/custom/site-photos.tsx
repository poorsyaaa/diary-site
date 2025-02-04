import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadThing";
import { SiteDiaryFormData, UpdateSiteDiaryFormData } from "@/types/schema";
import { toast } from "sonner";

export interface SitePhotosProps {
  control: Control<SiteDiaryFormData | UpdateSiteDiaryFormData>;
  setHasSelectedFiles: React.Dispatch<React.SetStateAction<boolean>>;
}

const SitePhotos: React.FC<SitePhotosProps> = ({ control, setHasSelectedFiles }) => {
  return (
    <FormField
      control={control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Site Photos</FormLabel>
          <FormControl>
            <UploadDropzone
              endpoint="imageUploader"
              onChange={(res) => {
                setHasSelectedFiles(res.length > 0);
              }}
              onClientUploadComplete={(res) => {
                setHasSelectedFiles(false);
                const uploadedUrls = res.map((file) => file.url);
                field.onChange(uploadedUrls);
              }}
              onUploadError={(error) => {
                toast.error("IMAGE_UPLOAD_ERROR", {
                  description: error.message || "An error occurred while uploading the image.",
                });
              }}
              className="upload-dropzone"
            />
          </FormControl>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {field.value &&
              Array.isArray(field.value) &&
              field.value.map((url: string, index: number) => (
                <div key={index} className="space-y-2">
                  <Image src={url} alt={`Uploaded ${index + 1}`} width={400} height={225} className="w-full aspect-video object-cover rounded-lg" />
                </div>
              ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SitePhotos;
