"use client";

import { Patient, RawPatient } from "./types";
import { PGliteWorker } from "@electric-sql/pglite/worker";

let db: PGliteWorker | null = null;

/**
 * Retrieves a singleton instance of the PGliteWorker for database operations.
 *
 * @throws Will throw an error if attempted to access on the server side.
 * @throws Will throw an error if the PGlite worker fails to initialize.
 *
 * @returns {PGliteWorker} The PGliteWorker instance managing the database connection.
 */

export function getDB() {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on the client side");
  }
  if (!db) {
    try {
      const worker = new Worker(
        new URL("./pglite-worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
      db = new PGliteWorker(worker);
    } catch (error) {
      console.error("Failed to initialize PGlite worker:", error);
      throw error;
    }
  }
  return db;
}

/**
 * Initializes the PGlite database by creating tables if they don't exist.
 * It also seeds a default user if no users are found in the database.
 *
 * @throws Throws an error if the database initialization fails.
 */
export async function initializeDB() {
  const dbInstance = getDB();

  try {
    await dbInstance.query(`
CREATE TABLE IF NOT EXISTS users (
email TEXT PRIMARY KEY,
password TEXT NOT NULL
);
`);

    await dbInstance.query(`
CREATE TABLE IF NOT EXISTS patients (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL,
phone TEXT NOT NULL,
dob DATE NOT NULL,
gender TEXT,
address TEXT,
medical_history TEXT,
status TEXT NOT NULL,
registered_date DATE NOT NULL
);
`);

    // Seed default user if none exists
    const { rows } = await dbInstance.query("SELECT COUNT(*) FROM users");
    const count = (rows[0] as { count: number }).count;
    if (count === 0) {
      await dbInstance.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        ["info@admin.com", "password"]
      );
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

/**
 * Fetch all patients from the database.
 *
 * @returns An array of Patient objects. If a database error occurs, an empty
 * array is returned.
 */
export async function fetchPatients(): Promise<Patient[]> {
  const dbInstance = getDB();
  try {
    const { rows } = await dbInstance.query<RawPatient>(
      "SELECT * FROM patients"
    );
    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      email: row.email,
      phone: row.phone,
      dob: new Date(row.dob),
      gender: row.gender || undefined,
      address: row.address || undefined,
      medicalHistory: row.medical_history || undefined,
      status: row.status as "Active" | "Inactive" | "Pending",
      registeredDate: new Date(row.registered_date),
    }));
  } catch (error) {
    console.error("Fetch patients error:", error);
    return [];
  }
}
