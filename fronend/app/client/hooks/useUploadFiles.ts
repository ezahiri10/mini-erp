import { useState } from "react";
import { useRouter } from "next/navigation";

interface UploadResponse {
  message: string;
  claim: {
    id: string;
    files: string[];
  };
  uploadedFiles: string[];
}

export const useUploadFiles = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFiles = async (claimId: string, files: File[]) => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      setLoading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`/api/client/claims/${claimId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(progressInterval);

      const data: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || "Upload failed");
      }

      setProgress(100);
      return data;
    } catch (err: any) {
      const message = err.message || "Error uploading files";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFiles,
    loading,
    error,
    progress,
  };
};
