import fs from "fs";
import path from "path";
import { put, del, list, head } from "@vercel/blob";

const IS_PROD = process.env.NODE_ENV === "production";

// ═══════════════════════════════════════════════════
//  Low-level read / write helpers
//  • Dev  → local filesystem (instant)
//  • Prod → Vercel Blob (persistent across deploys)
// ═══════════════════════════════════════════════════

// ─── JSON helpers ───

async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  if (!IS_PROD) {
    const filePath = path.join(process.cwd(), "data", filename);
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      return fallback;
    }
  }
  // Production: read from Vercel Blob
  try {
    const info = await head(`data/${filename}`, { token: process.env.BLOB_READ_WRITE_TOKEN! });
    const res = await fetch(info.url);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  if (!IS_PROD) {
    const filePath = path.join(process.cwd(), "data", filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return;
  }
  // Production: write to Vercel Blob (overwrites existing)
  await put(`data/${filename}`, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
}

// ─── Photo helpers ───

async function savePhotoFile(base64DataUrl: string): Promise<string> {
  const match = base64DataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");

  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (!IS_PROD) {
    const dir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);
    return `/uploads/${filename}`;
  }
  // Production: upload to Vercel Blob
  const blob = await put(`uploads/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
  return blob.url; // full public URL
}

async function deletePhotoFile(photoUrl: string): Promise<void> {
  if (!photoUrl || photoUrl.startsWith("data:")) return;

  if (!IS_PROD) {
    const filename = photoUrl.replace("/uploads/", "");
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    try { fs.unlinkSync(filePath); } catch { /* file may not exist */ }
    return;
  }
  // Production: delete from Vercel Blob
  try {
    await del(photoUrl, { token: process.env.BLOB_READ_WRITE_TOKEN! });
  } catch { /* silently handled */ }
}

// ═══════════════════════════════════════════════════
//  Employee CRUD
// ═══════════════════════════════════════════════════

export interface Employee {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportNumber: string;
  gender: string;
  photograph: string;
  age: number;
  status: string;
  createdAt: string;
}

export async function getAllEmployees(): Promise<Employee[]> {
  const employees = await readJSON<Employee[]>("employees.json", []);
  return employees.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createEmployee(data: Omit<Employee, "id" | "createdAt">): Promise<Employee> {
  let photoUrl = data.photograph;
  if (photoUrl.startsWith("data:")) {
    photoUrl = await savePhotoFile(photoUrl);
  }

  const employees = await readJSON<Employee[]>("employees.json", []);
  const newEmployee: Employee = {
    ...data,
    photograph: photoUrl,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  employees.push(newEmployee);
  await writeJSON("employees.json", employees);
  return newEmployee;
}

export async function updateEmployeeStatus(id: string, status: string): Promise<Employee | null> {
  const employees = await readJSON<Employee[]>("employees.json", []);
  const idx = employees.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  employees[idx].status = status;
  await writeJSON("employees.json", employees);
  return employees[idx];
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const employees = await readJSON<Employee[]>("employees.json", []);
  const target = employees.find((e) => e.id === id);
  if (!target) return false;
  await deletePhotoFile(target.photograph);
  const filtered = employees.filter((e) => e.id !== id);
  await writeJSON("employees.json", filtered);
  return true;
}

// ═══════════════════════════════════════════════════
//  Admin settings
// ═══════════════════════════════════════════════════

interface AdminSettings {
  username: string;
  password: string;
}

const DEFAULT_ADMIN: AdminSettings = { username: "admin", password: "admin123" };

export async function getAdminCredentials(): Promise<AdminSettings> {
  return readJSON<AdminSettings>("admin.json", DEFAULT_ADMIN);
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  const settings = await readJSON<AdminSettings>("admin.json", DEFAULT_ADMIN);
  settings.password = newPassword;
  await writeJSON("admin.json", settings);
}

// ═══════════════════════════════════════════════════
//  Utilities
// ═══════════════════════════════════════════════════

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
