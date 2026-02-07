import fs from "fs";
import path from "path";

// In production (Vercel), the project dir is read-only so we write to /tmp.
// On first access we copy the bundled seed file to /tmp, then read/write there.
// In development, we read/write directly in the project's data/ folder.

const IS_PROD = process.env.NODE_ENV === "production";

function resolveDataPath(filename: string): string {
  const projectPath = path.join(process.cwd(), "data", filename);
  if (!IS_PROD) return projectPath;

  const tmpPath = path.join("/tmp", filename);
  // Seed /tmp from bundled file if not already present
  if (!fs.existsSync(tmpPath) && fs.existsSync(projectPath)) {
    fs.copyFileSync(projectPath, tmpPath);
  }
  return tmpPath;
}

// ─── Employee types & helpers ───

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

export function getAllEmployees(): Employee[] {
  return readEmployees().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createEmployee(data: Omit<Employee, "id" | "createdAt">): Employee {
  const employees = readEmployees();
  const newEmployee: Employee = {
    ...data,
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
  const filtered = employees.filter((e) => e.id !== id);
  if (filtered.length === employees.length) return false;
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
