import { createHash } from "crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "admin_session";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "vehicle2026",
  };
}

export function createAuthToken(): string {
  const { password } = getAdminCredentials();
  return createHash("sha256").update(`vehicle-admin:${password}`).digest("hex");
}

export function verifyCredentials(username: string, password: string): boolean {
  const admin = getAdminCredentials();
  return username === admin.username && password === admin.password;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token === createAuthToken();
}
