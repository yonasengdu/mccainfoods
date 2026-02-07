import fs from "fs";
import path from "path";

const IS_PROD = process.env.NODE_ENV === "production";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// Lazy-import @vercel/blob only when we actually have a token
async function getBlobSDK() {
  if (!BLOB_TOKEN) return null;
  try {
    return await import("@vercel/blob");
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════
//  Low-level read / write helpers
//  • Dev  → local filesystem (instant)
//  • Prod + token → Vercel Blob (persistent)
//  • Prod no token → /tmp fallback (ephemeral)
// ═══════════════════════════════════════════════════

function tmpPath(filename: string): string {
  return path.join("/tmp", filename);
}

function localPath(filename: string): string {
  return path.join(process.cwd(), "data", filename);
}

// ─── JSON helpers ───

async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  // Dev: read from local data/ folder
  if (!IS_PROD) {
    try {
      return JSON.parse(fs.readFileSync(localPath(filename), "utf-8"));
    } catch {
      return fallback;
    }
  }

  // Prod with Vercel Blob
  const blob = await getBlobSDK();
  if (blob) {
    try {
      const info = await blob.head(`data/${filename}`, { token: BLOB_TOKEN! });
      const res = await fetch(info.url);
      if (res.ok) return (await res.json()) as T;
    } catch { /* blob not found or token issue, fall through */ }
  }

  // Prod fallback: try /tmp, then bundled data/
  try {
    if (fs.existsSync(tmpPath(filename))) {
      return JSON.parse(fs.readFileSync(tmpPath(filename), "utf-8"));
    }
    if (fs.existsSync(localPath(filename))) {
      return JSON.parse(fs.readFileSync(localPath(filename), "utf-8"));
    }
  } catch { /* ignore */ }
  return fallback;
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  // Dev: write to local data/ folder
  if (!IS_PROD) {
    fs.writeFileSync(localPath(filename), json, "utf-8");
    return;
  }

  // Prod with Vercel Blob
  const blob = await getBlobSDK();
  if (blob) {
    await blob.put(`data/${filename}`, json, {
      access: "public",
      addRandomSuffix: false,
      token: BLOB_TOKEN!,
    });
    return;
  }

  // Prod fallback: /tmp
  fs.writeFileSync(tmpPath(filename), json, "utf-8");
}

// ─── Photo helpers ───

async function savePhotoFile(base64DataUrl: string): Promise<string> {
  const match = base64DataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");

  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Dev: save to public/uploads/
  if (!IS_PROD) {
    const dir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);
    return `/uploads/${filename}`;
  }

  // Prod with Vercel Blob
  const blob = await getBlobSDK();
  if (blob) {
    const result = await blob.put(`uploads/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      token: BLOB_TOKEN!,
    });
    return result.url;
  }

  // Prod fallback: /tmp
  const dir = path.join("/tmp", "uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/api/uploads/${filename}`;
}

async function deletePhotoFile(photoUrl: string): Promise<void> {
  if (!photoUrl || photoUrl.startsWith("data:")) return;

  if (!IS_PROD) {
    const filename = photoUrl.replace("/uploads/", "");
    try { fs.unlinkSync(path.join(process.cwd(), "public", "uploads", filename)); } catch { /* ignore */ }
    return;
  }

  // Prod with Vercel Blob
  const blob = await getBlobSDK();
  if (blob && photoUrl.includes("blob.vercel-storage.com")) {
    try { await blob.del(photoUrl, { token: BLOB_TOKEN! }); } catch { /* ignore */ }
    return;
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
