import fs from "fs";
import path from "path";

const IS_PROD = process.env.NODE_ENV === "production";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// In production, we REQUIRE Vercel Blob for persistent storage.
// Fail loudly if the token is missing so data is never silently lost.
function requireBlobToken(): string {
  if (!BLOB_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. " +
      "Go to Vercel Dashboard → Storage → Create Blob Store → Connect to project, then redeploy."
    );
  }
  return BLOB_TOKEN;
}

// Lazy-load the blob SDK
let _blobSDK: typeof import("@vercel/blob") | null = null;
async function blob() {
  if (!_blobSDK) _blobSDK = await import("@vercel/blob");
  return _blobSDK;
}

// ═══════════════════════════════════════════════════
//  Low-level read / write helpers
//  • Dev  → local filesystem (instant)
//  • Prod → Vercel Blob (persistent, required)
// ═══════════════════════════════════════════════════

function localPath(filename: string): string {
  return path.join(process.cwd(), "data", filename);
}

async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  if (!IS_PROD) {
    try {
      return JSON.parse(fs.readFileSync(localPath(filename), "utf-8"));
    } catch {
      return fallback;
    }
  }

  const token = requireBlobToken();
  const sdk = await blob();
  try {
    const info = await sdk.head(`data/${filename}`, { token });
    const res = await fetch(info.url);
    if (res.ok) return (await res.json()) as T;
  } catch {
    // Blob doesn't exist yet -- return fallback (first run)
  }
  return fallback;
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  if (!IS_PROD) {
    fs.writeFileSync(localPath(filename), JSON.stringify(data, null, 2), "utf-8");
    return;
  }

  const token = requireBlobToken();
  const sdk = await blob();
  await sdk.put(`data/${filename}`, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    token,
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

  const token = requireBlobToken();
  const sdk = await blob();
  const result = await sdk.put(`uploads/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: false,
    token,
  });
  return result.url;
}

async function deletePhotoFile(photoUrl: string): Promise<void> {
  if (!photoUrl || photoUrl.startsWith("data:")) return;

  if (!IS_PROD) {
    const filename = photoUrl.replace("/uploads/", "");
    try { fs.unlinkSync(path.join(process.cwd(), "public", "uploads", filename)); } catch { /* ignore */ }
    return;
  }

  if (photoUrl.includes("blob.vercel-storage.com")) {
    const token = requireBlobToken();
    const sdk = await blob();
    try { await sdk.del(photoUrl, { token }); } catch { /* ignore */ }
  }
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
