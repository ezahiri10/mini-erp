import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Claim {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  assignedUser?: { name: string };
}

interface ClaimsResponse {
  claims: Claim[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const useClientClaims = (page: number = 1, status?: string) => {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  useEffect(() => {
    fetchClaims();
  }, [page, status]);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      setLoading(true);
      const statusParam = status ? `&status=${status}` : "";
      const response = await fetch(
        `/api/client/claims?page=${page}&limit=10${statusParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch claims");

      const data: ClaimsResponse = await response.json();
      setClaims(data.claims);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { claims, loading, error, pagination, refetch: fetchClaims };
};
