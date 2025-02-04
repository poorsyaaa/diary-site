import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-6 shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
          <p className="text-sm text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
