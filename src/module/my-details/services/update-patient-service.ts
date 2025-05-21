import { useState } from "react";
import { db } from "../../../lib/db";
import { Patient } from "../../../lib/types";

interface UpdatePatientResult {
  updatePatient: (patient: Patient) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to update a patient in the database
 *
 * @returns An object containing an async function to update a patient, a boolean indicating if the update is in progress, and an error string if the update fails
 */
export function useUpdatePatient(): UpdatePatientResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatient = async (patient: Patient): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await db.query(
        `
        UPDATE patients
        SET
          name = $1,
          email = $2,
          phone = $3,
          dob = $4,
          gender = $5,
          address = $6,
          medical_history = $7,
          status = $8
        WHERE id = $9
      `,
        [
          patient.name,
          patient.email,
          patient.phone,
          patient.dob,
          patient.gender,
          patient.address,
          patient.medicalHistory,
          patient.status,
          patient.id,
        ]
      );

      return true;
    } catch (err) {
      console.error("Update patient error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update patient";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePatient, loading, error };
}
