import { useState, useEffect } from "react";

// Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  comments: Comment[];
}

export interface Claim {
  id: string;
  title: string;
  description?: string;
  status: "SUBMITTED" | "IN_REVIEW" | "RESOLVED";
  assignedTo?: string;
  clientId: string;
  files: string[];
  createdAt: string;
  client: { id: string; name: string; email: string };
  comments: Comment[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  claims?: Claim[];
}

export interface Comment {
  id: string;
  text: string;
  author: { id: string; name: string; email: string };
  createdAt: string;
}

// ============= LEADS HOOKS =============

export function useOperatorLeads(page = 1, status?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    fetchLeads();
  }, [page, status]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.append("page", page.toString());
      if (status) query.append("status", status);

      const response = await fetch(`/api/operator/leads?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch leads");

      const data = await response.json();
      setLeads(data.leads);
      setPagination(data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { leads, loading, error, pagination, refetch: fetchLeads };
}

export function useOperatorLeadById(id: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/leads/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch lead");

      const data = await response.json();
      setLead(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { lead, loading, error, refetch: fetchLead };
}

// ============= CLAIMS HOOKS =============

export function useOperatorClaims(page = 1, status?: string) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    fetchClaims();
  }, [page, status]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.append("page", page.toString());
      if (status) query.append("status", status);

      const response = await fetch(`/api/operator/claims?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch claims");

      const data = await response.json();
      setClaims(data.claims);
      setPagination(data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { claims, loading, error, pagination, refetch: fetchClaims };
}

export function useOperatorClaimById(id: string) {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchClaim();
  }, [id]);

  const fetchClaim = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/claims/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch claim");

      const data = await response.json();
      setClaim(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { claim, loading, error, refetch: fetchClaim };
}

// ============= CLIENTS HOOKS =============

export function useOperatorClients(page = 1) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    fetchClients();
  }, [page]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/clients?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch clients");

      const data = await response.json();
      setClients(data.clients);
      setPagination(data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { clients, loading, error, pagination, refetch: fetchClients };
}

export function useOperatorClientById(id: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/clients/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch client");

      const data = await response.json();
      setClient(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { client, loading, error, refetch: fetchClient };
}

// ============= MUTATION HOOKS =============

export function useUpdateLeadStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      setError(null);
      return data.lead;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
}

export function useUpdateClaimStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/claims/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      setError(null);
      return data.claim;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
}

export function useAddClaimComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = async (claimId: string, text: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/claims/${claimId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const data = await response.json();
      setError(null);
      return data.comment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
}

export function useAddLeadComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = async (leadId: string, text: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/operator/leads/${leadId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const data = await response.json();
      setError(null);
      return data.comment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
}
