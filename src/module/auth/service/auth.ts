"use client";
import { db } from "@/lib/db";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

// Login and set session cookie
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const { rows } = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (rows.length > 0) {
      // Set session cookie to expire at end of day
      const today = new Date();
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );
      Cookies.set("app_secret", process.env.NEXT_PUBLIC_COOKIE_SECRET!, {
        expires: endOfDay,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });

      Cookies.set("session_token", uuidv4(), {
        expires: endOfDay,
        path: "/",
      });

      Cookies.set("email", email, {
        expires: endOfDay,
        path: "/",
      });

      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const sessionToken = Cookies.get("session_token");
  const username = Cookies.get("email");
  return !!sessionToken && !!username;
}

// Logout and clear session
export function logout(): void {
  Cookies.remove("session_token");
  Cookies.remove("email");
}
