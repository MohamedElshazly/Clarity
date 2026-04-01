import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDraftRecord,
  updateDraftRecord,
  submitRecord,
  getDraftRecord,
} from "@/lib/api/records";
import { useUser } from "./use-user";
import type {
  ThoughtRecordInsert,
  ThoughtRecordUpdate,
} from "@/lib/types/database";

/**
 * Hook to create a draft record
 */
export function useCreateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<ThoughtRecordInsert>;
    }) => createDraftRecord(userId, data),
    onSuccess: () => {
      // Invalidate dashboard queries to refresh stats
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

/**
 * Hook to update a draft record
 */
export function useUpdateDraft() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ThoughtRecordUpdate>;
    }) => updateDraftRecord(id, data),
  });
}

/**
 * Hook to submit a record (finalize)
 */
export function useSubmitRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      recordId,
      data,
    }: {
      userId: string;
      recordId: string | null;
      data: ThoughtRecordInsert;
    }) => submitRecord(userId, recordId, data),
    onSuccess: () => {
      // Invalidate all record-related queries
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}

/**
 * Hook to get a draft record by ID
 */
export function useGetDraft(id: string | null) {
  return useQuery({
    queryKey: ["draft", id],
    queryFn: () => getDraftRecord(id!),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh draft data
  });
}
