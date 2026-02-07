import { cookies } from "next/headers";

export const DEFAULT_USERNAME = "admin";
export const DEFAULT_PASSWORD = "admin123";
export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_TOKEN_VALUE = "mccain-admin-authenticated-2026";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_TOKEN_VALUE;
}
