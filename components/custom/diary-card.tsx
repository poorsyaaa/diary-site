import { SiteDiaryData } from "@/lib/queries/site-diary.queries";
import { AlertCircle, CheckCircle2, Clock1, Cloud, Users, Camera, HardHat, Wrench, Hammer, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useDeleteSiteDiaryMutation } from "@/lib/mutation/site-diary.mutation";
import LoadingOverlay from "@/components/custom/loading-overlay";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SiteDiaryFormModal from "@/components/custom/site-diary-form-modal";

interface DiaryCardProps {
  diary: SiteDiaryData;
  getSiteName: (siteId: string) => string;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary }) => {
  const [isEditSiteDiaryModalOpen, setIsEditSiteDiaryModalOpen] = useState(false);

  const date = new Date(diary.updatedAt);
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const router = useRouter();

  const queryClient = useQueryClient();
  const { mutateAsync: deleteSiteDiary, isPending } = useDeleteSiteDiaryMutation();

  const handleDeleteDiary = async () => {
    await deleteSiteDiary(diary.id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["site-diaries"],
        });
        router.push("/");
      },
    });
  };
  const handleViewDetails = () => {
    router.push(`/diary/${diary.id}`);
  };

  return (
    <>
      <LoadingOverlay isLoading={isPending} message={"Deleting..."} />
      <Card className="hover:shadow-lg transition-all duration-200 flex flex-col h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base">{diary.currentPhase || "No phase specified"}</CardTitle>
              <CardDescription className="flex items-center">{diary.description || "No description"}</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={diary.hasDelaysOrIssues ? "destructive" : "secondary"} className="flex items-center gap-1.5">
                    {diary.hasDelaysOrIssues ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Has Issues
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        On Track
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{diary.hasDelaysOrIssues ? "Project has reported issues or delays" : "Project is proceeding as planned"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline">
                    <Clock1 className="w-4 h-4 mr-1" />
                    {time}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Entry/Updated Time</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Metrics */}
          <div className="flex flex-wrap gap-3">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  <Cloud className="w-4 h-4 mr-1.5" />
                  <span className="capitalize">{diary.weather}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Weather Condition</TooltipContent>
            </Tooltip>

            {diary.visitors?.length > 0 && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span>{diary.visitors.length} visitors</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{diary.visitors.length} site visitors today</TooltipContent>
              </Tooltip>
            )}

            {diary.images?.length > 0 && (
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    <Camera className="w-4 h-4 mr-1.5" />
                    <span>{diary.images.length} photos</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{diary.images.length} site photos captured</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Resources */}
          <div className="flex items-center divide-x divide-border">
            {diary.labor && (
              <Tooltip>
                <TooltipTrigger className="pr-4 flex items-center text-sm">
                  <HardHat className="w-4 h-4 mr-1.5" />
                  Labor
                </TooltipTrigger>
                <TooltipContent>Labor resources utilized</TooltipContent>
              </Tooltip>
            )}

            {diary.equipment && (
              <Tooltip>
                <TooltipTrigger className="px-4 flex items-center text-sm">
                  <Wrench className="w-4 h-4 mr-1.5" />
                  Equipment
                </TooltipTrigger>
                <TooltipContent>Equipment in use</TooltipContent>
              </Tooltip>
            )}

            {diary.materials && (
              <Tooltip>
                <TooltipTrigger className="pl-4 flex items-center text-sm">
                  <Hammer className="w-4 h-4 mr-1.5" />
                  Materials
                </TooltipTrigger>
                <TooltipContent>Materials in use</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 mt-auto flex justify-end">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="me-1" onClick={handleViewDetails}>
                View
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Diary Entry</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="me-1" onClick={() => setIsEditSiteDiaryModalOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Diary Entry</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleDeleteDiary} disabled={isPending}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Diary Entry</TooltipContent>
          </Tooltip>

          <SiteDiaryFormModal initialData={diary} open={isEditSiteDiaryModalOpen} onClose={() => setIsEditSiteDiaryModalOpen((prev) => !prev)} mode="update" />
        </CardFooter>
      </Card>
    </>
  );
};

export default DiaryCard;
