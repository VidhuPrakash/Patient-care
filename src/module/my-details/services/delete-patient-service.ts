"use client";

import { useState } from "react";
import { db } from "../../../lib/db";

interface DeletePatientResult {
  deletePatient: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to delete a patient in the database
 *
 * @returns An object containing an async function to delete a patient, a boolean indicating if the deletion is in progress, and an error string if the deletion fails
 */
export function useDeletePatient(): DeletePatientResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePatient = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await db.query("DELETE FROM patients WHERE id = $1", [id]);
      if (!result) {
        throw new Error("Patient not found");
      }
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete patient";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePatient, loading, error };
}
