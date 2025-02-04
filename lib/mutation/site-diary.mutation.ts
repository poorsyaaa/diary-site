import { useMutation } from "@tanstack/react-query";
import { createMutationFn } from "../api-utils";
import { SiteDiaryFormData, UpdateSiteDiaryFormData } from "@/types/schema";

export const saveSiteDiary = async (data: SiteDiaryFormData) => {
  const response = await fetch("/api/diary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
};

export const useSaveSiteDiaryMutation = () =>
  useMutation(
    createMutationFn<
      SiteDiaryFormData,
      {
        id: number;
      }
    >(saveSiteDiary, "Site diary saved successfully")()
  );

export const deleteSiteDiary = async (id: number) => {
  const response = await fetch(`/api/diary/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return response;
};

export const useDeleteSiteDiaryMutation = () =>
  useMutation(
    createMutationFn<
      number,
      {
        message: string;
      }
    >(deleteSiteDiary, "Site diary deleted successfully")()
  );

export const updateSiteDiary = async (data: UpdateSiteDiaryFormData) => {
  const response = await fetch(`/api/diary/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
};

export const useUpdateSiteDiaryMutation = () =>
  useMutation(
    createMutationFn<
      UpdateSiteDiaryFormData,
      {
        message: string;
      }
    >(updateSiteDiary, "Site diary updated successfully")()
  );
