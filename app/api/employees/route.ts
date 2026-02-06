import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_VALUE } from "@/lib/auth";

function isAuthed(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_TOKEN_VALUE;
}

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fullName, phoneNumber, passportNumber, gender, photograph, age, status } = body;

    if (!fullName || !phoneNumber || !passportNumber || !gender || !photograph || !age) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected"];
    const applicantStatus = status && validStatuses.includes(status) ? status : "pending";

    const applicant = await prisma.employee.create({
      data: {
        fullName,
        phoneNumber,
        passportNumber,
        gender,
        photograph,
        age: parseInt(age, 10),
        status: applicantStatus,
      },
    });

    return NextResponse.json(applicant, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create applicant" },
      { status: 500 }
    );
  }
}
