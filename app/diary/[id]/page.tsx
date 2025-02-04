"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Trash2, Users } from "lucide-react";
import { useGetSiteDiaryByIdQuery } from "@/lib/queries/site-diary.queries";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useDeleteSiteDiaryMutation } from "@/lib/mutation/site-diary.mutation";
import LoadingOverlay from "@/components/custom/loading-overlay";
import { useQueryClient } from "@tanstack/react-query";
import { SITE_OPTIONS } from "@/constants/options";
import { format } from "date-fns";

function SiteDiaryDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { data: siteDiary, isLoading } = useGetSiteDiaryByIdQuery(parseInt(id, 10));
  const { mutateAsync: deleteSiteDiary, isPending } = useDeleteSiteDiaryMutation();

  const handleDeleteDiary = async () => {
    await deleteSiteDiary(parseInt(id, 10), {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["site-diaries"],
        });
        router.push("/");
      },
    });
  };

  const getSiteName = (siteId: string) => SITE_OPTIONS.find((site) => site.id === siteId)?.name ?? siteId;

  if (isLoading) return <LoadingOverlay isLoading={isLoading} message={"Loading..."} />;

  return (
    <>
      <LoadingOverlay isLoading={isPending} message={"Deleting..."} />
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Site Diary Entry</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={handleDeleteDiary} disabled={isPending}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{format(new Date(siteDiary?.date ?? ""), "PPP")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Weather</p>
                <p className="capitalize">{siteDiary?.weather}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Site Location</p>
                <p className="capitalize">{getSiteName(siteDiary?.siteLocation ?? "")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Current Phase</p>
                <p className="capitalize">{siteDiary?.currentPhase}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm capitalize">{siteDiary?.description}</p>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Work Completed</p>
                  <p className="text-sm capitalize">{siteDiary?.workCompleted}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Progress Details</p>
                  <p className="text-sm capitalize">{siteDiary?.currentPhase}</p>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500">Resources</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">Labor</p>
                  <p className="text-sm capitalize">{siteDiary?.labor}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">Equipment</p>
                  <p className="text-sm capitalize">{siteDiary?.equipment}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">Materials</p>
                  <p className="text-sm capitalize">{siteDiary?.materials}</p>
                </div>
              </div>
            </div>

            {/* Site Records */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">Site Records</p>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                {siteDiary?.visitors.map((visitor, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Visitor Type</p>
                        <p className="text-sm capitalize">{visitor.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm capitalize">{visitor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Company</p>
                        <p className="text-sm capitalize">{visitor.company}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">{visitor.type === "delivery" ? "Items/Quantity" : "Purpose of Visit"}</p>
                        <p className="text-sm capitalize">{visitor.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Issues</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm">{siteDiary?.delaysOrIssues ? "Yes" : "No issues reported"}</p>
              </div>
            </div>

            {/* Photos */}
            {siteDiary?.images && siteDiary?.images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Site Photos</p>
                <div className="grid grid-cols-2 gap-4">
                  {siteDiary?.images.map((url, index) => (
                    <div key={index} className="relative aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                      <Image
                        src={url}
                        alt={`Site photo ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-md"
                        width={50}
                        height={50}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default SiteDiaryDetail;
