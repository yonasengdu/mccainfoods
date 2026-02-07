import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

// ═══════════════════════════════════════════════════
//  Employee CRUD — MongoDB
// ═══════════════════════════════════════════════════

export interface Employee {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportNumber: string;
  gender: string;
  photograph: string; // base64 data URL stored directly in MongoDB
  age: number;
  status: string;
  createdAt: string;
}

interface EmployeeDoc {
  _id: ObjectId;
  fullName: string;
  phoneNumber: string;
  passportNumber: string;
  gender: string;
  photograph: string;
  age: number;
  status: string;
  createdAt: string;
}

function toEmployee(doc: EmployeeDoc): Employee {
  return {
    id: doc._id.toHexString(),
    fullName: doc.fullName,
    phoneNumber: doc.phoneNumber,
    passportNumber: doc.passportNumber,
    gender: doc.gender,
    photograph: doc.photograph,
    age: doc.age,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb();
  const docs = await db
    .collection<EmployeeDoc>("employees")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toEmployee);
}

export async function createEmployee(data: Omit<Employee, "id" | "createdAt">): Promise<Employee> {
  const db = await getDb();
  const doc = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  const result = await db.collection("employees").insertOne(doc);
  return {
    ...data,
    id: result.insertedId.toHexString(),
    createdAt: doc.createdAt,
  };
}

export async function updateEmployeeStatus(id: string, status: string): Promise<Employee | null> {
  const db = await getDb();
  const result = await db.collection<EmployeeDoc>("employees").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status } },
    { returnDocument: "after" }
  );
  return result ? toEmployee(result) : null;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection("employees").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// ═══════════════════════════════════════════════════
//  Admin settings — MongoDB
// ═══════════════════════════════════════════════════

interface AdminSettings {
  username: string;
  password: string;
}

const DEFAULT_ADMIN: AdminSettings = { username: "admin", password: "admin123" };

export async function getAdminCredentials(): Promise<AdminSettings> {
  const db = await getDb();
  const doc = await db.collection<AdminSettings>("admin_settings").findOne({ _id: "admin" as unknown as ObjectId });
  if (doc) return { username: doc.username, password: doc.password };
  return DEFAULT_ADMIN;
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  const db = await getDb();
  await db.collection("admin_settings").updateOne(
    { _id: "admin" as unknown as ObjectId },
    { $set: { password: newPassword } },
    { upsert: true }
  );
}
