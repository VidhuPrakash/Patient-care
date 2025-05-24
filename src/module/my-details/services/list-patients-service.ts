import { useEffect, useState } from "react";
import { Patient } from "../../../lib/types";
import { fetchPatients } from "@/lib/db";
import { patientChannel } from "@/lib/broadcast";

interface ListPatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  loadPatients: () => Promise<void>;
}

/**
 * Hook to fetch and track the list of patients
 * @returns An object containing the list of patients, a loading boolean, an error string, and a function to load the list of patients
 */
export function useListPatients(): ListPatientsResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the list of patients from the database and updates the local state.
   * If an error occurs during the fetch, logs the error, sets an error message,
   * and clears the patients list.
   *
   * Sets loading state to true before starting the fetch and sets it to false
   * once the fetch is completed, whether successful or not.
   */

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch patients";
      setError(errorMessage);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();

    // Listen for patient events from other tabs
    const handlePatientEvent = (event: MessageEvent) => {
      if (
        event.data.type === "PATIENT_REGISTERED" ||
        event.data.type === "PATIENT_UPDATED" ||
        event.data.type === "PATIENT_DELETED"
      ) {
        setTimeout(() => {
          loadPatients();
        }, 100);
      }
    };

    patientChannel.addEventListener("message", handlePatientEvent);

    return () => {
      patientChannel.removeEventListener("message", handlePatientEvent);
    };
  }, []);

  return { patients, loading, error, loadPatients };
}
