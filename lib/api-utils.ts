import { toast } from "sonner";

export interface ApiError {
  code?: string;
  message: string;
  status: number;
  statusText: string;
}

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const responseError = await response.json();
    const error: ApiError = {
      code: responseError.code,
      message: responseError.message,
      status: response.status,
      statusText: response.statusText,
    };
    throw error;
  }

  return (await response.json()).data;
};

export const createQueryFn =
  <TResponse>(queryFn: () => Promise<Response>) =>
  async (): Promise<TResponse | null> => {
    const response = await queryFn();

    if (response.status === 404) {
      return null;
    }

    return handleApiResponse<TResponse>(response);
  };

export type MutationConfig<TData = unknown> = {
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
  skipToast?: boolean;
};

export const createMutationFn = <TRequest, TResponse>(mutationFn: (body: TRequest, successMessage: string) => Promise<Response>, successMessage: string) => {
  return (config?: MutationConfig<TResponse>) => ({
    mutationFn: async (data: TRequest): Promise<TResponse> => {
      const response = await mutationFn(data, successMessage);
      return handleApiResponse<TResponse>(response);
    },
    onSuccess: async (data: TResponse) => {
      if (!config?.skipToast) {
        toast.success(successMessage);
      }
      if (config?.onSuccess) {
        await config.onSuccess(data);
      }
    },
    onError: async (error: ApiError) => {
      if (!config?.skipToast) {
        toast.error(error.code, {
          description: error.message,
        });
      }
      if (config?.onError) {
        await config.onError(error);
      }
    },
  });
};
