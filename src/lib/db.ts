import { PGlite } from "@electric-sql/pglite";
import { Patient } from "./types";

// Initialize PGlite with IndexedDB for persistence
export const db = new PGlite("idb://patient-registration-app");

// Initialize database tables
export async function initializeDB() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        password TEXT NOT NULL
      );
    `);

    // Create patients table
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        dob DATE NOT NULL,
        status TEXT NOT NULL,
        registered_date DATE NOT NULL
      );
    `);

    // Seed default user if none exists
    const { rows } = await db.query("SELECT COUNT(*) FROM users");
    const count = (rows[0] as { count: number }).count;
    if (count === 0) {
      await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
        "info@admin.com",
        "password",
      ]);
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}
