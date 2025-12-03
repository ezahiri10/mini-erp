import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Claim {
  id: string;
  title: string;
  description: string;
  status: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
  assignedUser?: { id: string; name: string; email: string };
  comments?: Comment[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: { id: string; name: string };
}

export const useClientClaim = (claimId: string) => {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (claimId) {
      fetchClaim();
    }
  }, [claimId]);

  const fetchClaim = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      setLoading(true);
      const response = await fetch(`/api/client/claims/${claimId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch claim");

      const data: Claim = await response.json();
      setClaim(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (text: string) => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const response = await fetch(`/api/client/claims/${claimId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      await fetchClaim(); // Refresh claim
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    claim,
    loading,
    error,
    refetch: fetchClaim,
    addComment,
  };
};
