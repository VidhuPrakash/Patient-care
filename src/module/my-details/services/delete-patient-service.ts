import { useState } from "react";
import { patientChannel } from "@/lib/broadcast";
import { getDB } from "@/lib/db";

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

  /**
   * Deletes a patient in the database and broadcasts the event to other tabs
   * @param id The id of the patient to delete
   * @returns A boolean indicating if the deletion was successful
   */
  const deletePatient = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const db = getDB();
    try {
      await db.query("BEGIN");
      const result = await db.query("DELETE FROM patients WHERE id = $1", [id]);
      await db.query("COMMIT");
      if (!result) {
        throw new Error("Patient not found");
      }

      patientChannel.postMessage({ type: "PATIENT_DELETED", patientId: id });
      return true;
    } catch (err) {
      await db.query("ROLLBACK");
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
