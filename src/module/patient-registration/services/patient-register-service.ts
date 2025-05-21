"use client";

import { useState } from "react";
import { db } from "../../../lib/db";
import { Patient } from "../../../lib/types";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

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

export function useRegisterPatient(): RegisterPatientResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPatient = async (
    input: RegisterPatientInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
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

      return true;
    } catch (err) {

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
