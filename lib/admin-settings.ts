import { prisma } from "@/lib/prisma";
import { DEFAULT_USERNAME, DEFAULT_PASSWORD } from "@/lib/auth";

export async function getAdminCredentials(): Promise<{ username: string; password: string }> {
  try {
    const settings = await prisma.adminSettings.findUnique({ where: { id: "admin" } });
    if (settings) {
      return { username: settings.username, password: settings.password };
    }
  } catch { /* table may not exist yet */ }
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
}

export async function updateAdminPassword(newPassword: string, currentUsername: string): Promise<void> {
  // Use find + create/update instead of upsert to avoid pgbouncer transaction issues
  const existing = await prisma.adminSettings.findUnique({ where: { id: "admin" } });
  if (existing) {
    await prisma.adminSettings.update({
      where: { id: "admin" },
      data: { password: newPassword },
    });
  } else {
    await prisma.adminSettings.create({
      data: { id: "admin", username: currentUsername, password: newPassword },
    });
  }
}
