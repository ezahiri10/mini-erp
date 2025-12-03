import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateClaimResponse {
  message: string;
  claim: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
  };
}

export const useCreateClaim = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClaim = async (title: string, description: string) => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch("/api/client/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data: CreateClaimResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || "Failed to create claim");
      }

      return data.claim;
    } catch (err: any) {
      const message = err.message || "Error creating claim";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createClaim,
    loading,
    error,
  };
};
