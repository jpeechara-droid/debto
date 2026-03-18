"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  DashboardData,
  CreditReportData,
  AIAnalysisData,
  SessionUser,
} from "@/types";

// ─── Generic Fetch Hook ─────────────────────────────────────────

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string, options?: { skip?: boolean }): UseFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!options?.skip) {
      fetchData();
    }
  }, [fetchData, options?.skip]);

  return { data, loading, error, refetch: fetchData };
}

// ─── Mutation Hook ──────────────────────────────────────────────

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (body: Record<string, unknown>) => Promise<T | null>;
  reset: () => void;
}

function useMutation<T>(url: string, method = "POST"): UseMutationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (body: Record<string, unknown>) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const responseBody = await res.json().catch(() => ({}));
          throw new Error(responseBody.error || `Request failed (${res.status})`);
        }

        const json = await res.json();
        setData(json);
        return json;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}

// ─── Domain-Specific Hooks ──────────────────────────────────────

export function useSession() {
  return useFetch<{ authenticated: boolean; user: SessionUser }>(
    "/api/auth/session"
  );
}

export function useDashboard() {
  return useFetch<DashboardData>("/api/dashboard");
}

export function useCreditReport() {
  return useFetch<CreditReportData>("/api/credit-report");
}

export function useAIAnalysis() {
  return useFetch<AIAnalysisData>("/api/ai-analysis");
}

export function useProfile() {
  const fetch = useFetch<Record<string, unknown>>("/api/settings/profile");
  const update = useMutation<Record<string, unknown>>("/api/settings/profile", "PUT");
  return { ...fetch, updateProfile: update.mutate, updating: update.loading, updateError: update.error };
}

export function useSendOTP() {
  return useMutation<{ success: boolean; message: string }>("/api/auth/send-otp");
}

export function useVerifyOTP() {
  return useMutation<{
    success: boolean;
    user: { id: string; phone: string; isNewUser: boolean; kycComplete: boolean };
  }>("/api/auth/verify-otp");
}

export function useVerifyPAN() {
  return useMutation<{
    success: boolean;
    verified: boolean;
    name?: string;
    panNumber?: string;
  }>("/api/kyc/verify-pan");
}

export function useSubmitIdentity() {
  return useMutation<{ success: boolean }>("/api/kyc/submit-identity");
}

export function useRecordConsent() {
  return useMutation<{ success: boolean }>("/api/kyc/consent");
}

export function useFetchCIBIL() {
  return useMutation<{
    success: boolean;
    reportId: string;
    creditScore: number;
  }>("/api/cibil/fetch-report");
}

export function useGenerateAnalysis() {
  return useMutation<AIAnalysisData>("/api/ai-analysis/generate");
}

export function useExtraPaymentCalc() {
  return useMutation<Record<string, unknown>>("/api/calculators/extra-payment");
}

export function useBalanceTransferCalc() {
  return useMutation<Record<string, unknown>>("/api/calculators/balance-transfer");
}

export function useBookConsultation() {
  return useMutation<Record<string, unknown>>("/api/consultation/book");
}

export function useVerifyPayment() {
  return useMutation<Record<string, unknown>>("/api/consultation/payment");
}
