import { useState } from "react";
import { Patient } from "../../../lib/types";
import { fetchPatients } from "@/lib/db";

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

  return { patients, loading, error, loadPatients };
}
