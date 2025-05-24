import { useState } from "react";
import { getDB } from "../../../lib/db";
import { Patient } from "../../../lib/types";
import dayjs from "dayjs";
import { patientChannel } from "@/lib/broadcast";

interface RegisterPatientInput {
  fullName: string;
  email: string;
  phone: string;
  dob: dayjs.Dayjs;
  gender?: string;
  address?: string;
  medicalHistory?: string;
}

interface RegisterPatientResult {
  loading: boolean;
  error: string | null;
  registerPatient: (input: RegisterPatientInput) => Promise<boolean>;
}

/**
 * Custom hook to handle patient registration.
 *
 * @returns An object containing:
 * - `loading`: A boolean indicating if the registration is in progress.
 * - `error`: A string representing the error message if the registration fails, or null if no error.
 * - `registerPatient`: An async function that takes `RegisterPatientInput` and returns a boolean indicating if the registration was successful.
 */

export function useRegisterPatient(): RegisterPatientResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Registers a patient and broadcasts the event to other tabs
   * @param input The patient registration input
   * @returns A boolean indicating if the registration was successful
   */
  const registerPatient = async (
    input: RegisterPatientInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    const db = getDB();

    try {
      await db.query("BEGIN");

      const patient: Patient & { registered_date: Date } = {
        name: input.fullName,
        email: input.email,
        phone: input.phone,
        dob: input.dob.toDate(),
        gender: input.gender!,
        address: input.address!,
        medicalHistory: input.medicalHistory!,
        status: "Pending",
        registeredDate: new Date(),
        registered_date: new Date(),
      };

      await db.query(
        `
        INSERT INTO patients (
          name, email, phone, dob, gender, address, medical_history, status, registered_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
          patient.registered_date,
        ]
      );
      await db.query("COMMIT");
      patientChannel.postMessage({ type: "PATIENT_REGISTERED" });

      return true;
    } catch (err) {
      await db.query("ROLLBACK");
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register patient";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerPatient };
}
