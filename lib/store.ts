import fs from "fs";
import path from "path";

// In production (Vercel), the project dir is read-only so we write to /tmp.
// In development, we read/write directly in the project's data/ folder.

const IS_PROD = process.env.NODE_ENV === "production";

function resolveDataPath(filename: string): string {
  const projectPath = path.join(process.cwd(), "data", filename);
  if (!IS_PROD) return projectPath;

  const tmpPath = path.join("/tmp", filename);
  if (!fs.existsSync(tmpPath) && fs.existsSync(projectPath)) {
    fs.copyFileSync(projectPath, tmpPath);
  }
  return tmpPath;
}

function getUploadsDir(): string {
  if (!IS_PROD) {
    const dir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
  const dir = path.join("/tmp", "uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ─── Image helpers ───

/** Save a base64 data URL as a file. Returns the public URL path. */
export function savePhoto(base64DataUrl: string): string {
  const match = base64DataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");

  const ext = match[1] === "jpeg" ? "jpg" : match[1];
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = path.join(getUploadsDir(), filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

/** Delete a photo file by its URL path. */
function deletePhotoFile(photoUrl: string): void {
  if (!photoUrl || photoUrl.startsWith("data:")) return;
  const filename = photoUrl.replace("/uploads/", "");
  const filePath = path.join(getUploadsDir(), filename);
  try { fs.unlinkSync(filePath); } catch { /* file may not exist */ }
}

// ─── Employee types & helpers ───

export interface Employee {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportNumber: string;
  gender: string;
  photograph: string; // URL path like /uploads/abc.jpg
  age: number;
  status: string;
  createdAt: string;
}

function readEmployees(): Employee[] {
  const filePath = resolveDataPath("employees.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeEmployees(employees: Employee[]): void {
  const filePath = resolveDataPath("employees.json");
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2), "utf-8");
}

/** Migrate any remaining base64 photographs to files. Run once on first access. */
let migrated = false;
function migrateBase64Photos(): void {
  if (migrated) return;
  migrated = true;
  const employees = readEmployees();
  let changed = false;
  for (const emp of employees) {
    if (emp.photograph && emp.photograph.startsWith("data:")) {
      try {
        emp.photograph = savePhoto(emp.photograph);
        changed = true;
      } catch { /* skip invalid images */ }
    }
  }
  if (changed) writeEmployees(employees);
}

export function getAllEmployees(): Employee[] {
  migrateBase64Photos();
  return readEmployees().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createEmployee(data: Omit<Employee, "id" | "createdAt">): Employee {
  // Save photo as file, store only URL
  let photoUrl = data.photograph;
  if (photoUrl.startsWith("data:")) {
    photoUrl = savePhoto(photoUrl);
  }

  const employees = readEmployees();
  const newEmployee: Employee = {
    ...data,
    photograph: photoUrl,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  employees.push(newEmployee);
  writeEmployees(employees);
  return newEmployee;
}

export function updateEmployeeStatus(id: string, status: string): Employee | null {
  const employees = readEmployees();
  const idx = employees.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  employees[idx].status = status;
  writeEmployees(employees);
  return employees[idx];
}

export function deleteEmployee(id: string): boolean {
  const employees = readEmployees();
  const target = employees.find((e) => e.id === id);
  if (!target) return false;
  deletePhotoFile(target.photograph);
  const filtered = employees.filter((e) => e.id !== id);
  writeEmployees(filtered);
  return true;
}

// ─── Admin settings ───

interface AdminSettings {
  username: string;
  password: string;
}

function readAdmin(): AdminSettings {
  const filePath = resolveDataPath("admin.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { username: "admin", password: "admin123" };
  }
}

function writeAdmin(settings: AdminSettings): void {
  const filePath = resolveDataPath("admin.json");
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
}

export function getAdminCredentials(): AdminSettings {
  return readAdmin();
}

export function updateAdminPassword(newPassword: string): void {
  const settings = readAdmin();
  settings.password = newPassword;
  writeAdmin(settings);
}

// ─── Utilities ───

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
