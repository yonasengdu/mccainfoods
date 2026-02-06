"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/components/AuthProvider";

interface Employee {
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

const STATUS_COLORS: Record<string, { row: string; badge: string; dot: string }> = {
  pending: {
    row: "bg-yellow-50 hover:bg-yellow-100/80",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    dot: "bg-yellow-400",
  },
  approved: {
    row: "bg-green-50 hover:bg-green-100/80",
    badge: "bg-green-100 text-green-800 border-green-300",
    dot: "bg-green-500",
  },
  rejected: {
    row: "bg-red-50 hover:bg-red-100/80",
    badge: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-500",
  },
};

const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", label: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", label: "New Zealand" },
  { code: "+33", country: "FR", flag: "🇫🇷", label: "France" },
  { code: "+49", country: "DE", flag: "🇩🇪", label: "Germany" },
  { code: "+31", country: "NL", flag: "🇳🇱", label: "Netherlands" },
  { code: "+32", country: "BE", flag: "🇧🇪", label: "Belgium" },
  { code: "+48", country: "PL", flag: "🇵🇱", label: "Poland" },
  { code: "+39", country: "IT", flag: "🇮🇹", label: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", label: "Spain" },
  { code: "+351", country: "PT", flag: "🇵🇹", label: "Portugal" },
  { code: "+43", country: "AT", flag: "🇦🇹", label: "Austria" },
  { code: "+41", country: "CH", flag: "🇨🇭", label: "Switzerland" },
  { code: "+420", country: "CZ", flag: "🇨🇿", label: "Czech Republic" },
  { code: "+421", country: "SK", flag: "🇸🇰", label: "Slovakia" },
  { code: "+30", country: "GR", flag: "🇬🇷", label: "Greece" },
  { code: "+46", country: "SE", flag: "🇸🇪", label: "Sweden" },
  { code: "+358", country: "FI", flag: "🇫🇮", label: "Finland" },
  { code: "+36", country: "HU", flag: "🇭🇺", label: "Hungary" },
  { code: "+91", country: "IN", flag: "🇮🇳", label: "India" },
  { code: "+81", country: "JP", flag: "🇯🇵", label: "Japan" },
  { code: "+886", country: "TW", flag: "🇹🇼", label: "Taiwan" },
  { code: "+60", country: "MY", flag: "🇲🇾", label: "Malaysia" },
  { code: "+86", country: "CN", flag: "🇨🇳", label: "China" },
  { code: "+27", country: "ZA", flag: "🇿🇦", label: "South Africa" },
  { code: "+55", country: "BR", flag: "🇧🇷", label: "Brazil" },
  { code: "+54", country: "AR", flag: "🇦🇷", label: "Argentina" },
  { code: "+57", country: "CO", flag: "🇨🇴", label: "Colombia" },
  { code: "+52", country: "MX", flag: "🇲🇽", label: "Mexico" },
  { code: "+251", country: "ET", flag: "🇪🇹", label: "Ethiopia" },
  { code: "+971", country: "AE", flag: "🇦🇪", label: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+90", country: "TR", flag: "🇹🇷", label: "Turkey" },
  { code: "+234", country: "NG", flag: "🇳🇬", label: "Nigeria" },
  { code: "+254", country: "KE", flag: "🇰🇪", label: "Kenya" },
  { code: "+20", country: "EG", flag: "🇪🇬", label: "Egypt" },
];

interface FieldErrors {
  fullName?: string;
  phoneNumber?: string;
  passportNumber?: string;
  gender?: string;
  age?: string;
  photograph?: string;
  status?: string;
}

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();
  const { logout } = useAuth();

  // Form state
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+251");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [gender, setGender] = useState("");
  const [photograph, setPhotograph] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [age, setAge] = useState("");
  const [formStatus, setFormStatus] = useState("pending");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (Array.isArray(data)) setEmployees(data);
    } catch {
      /* fetch error handled silently */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: employees.length, pending: 0, approved: 0, rejected: 0 };
    employees.forEach((emp) => {
      if (emp.status in counts) counts[emp.status as keyof typeof counts]++;
    });
    return counts;
  }, [employees]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, photograph: "Photo must be less than 5MB" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, photograph: "File must be an image" }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, photograph: undefined }));
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotograph(base64);
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFullName("");
    setCountryCode("+251");
    setPhoneLocal("");
    setPassportNumber("");
    setGender("");
    setPhotograph("");
    setPhotoPreview("");
    setAge("");
    setFormStatus("pending");
    setError("");
    setFieldErrors({});
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    // Full name: at least 2 words, letters only
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      errors.fullName = "Full name is required";
    } else if (trimmedName.length < 3) {
      errors.fullName = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedName)) {
      errors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Phone: digits only, 4-15 digits
    const digitsOnly = phoneLocal.replace(/[\s\-()]/g, "");
    if (!digitsOnly) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(digitsOnly)) {
      errors.phoneNumber = "Phone number can only contain digits";
    } else if (digitsOnly.length < 4) {
      errors.phoneNumber = "Phone number is too short (min 4 digits)";
    } else if (digitsOnly.length > 15) {
      errors.phoneNumber = "Phone number is too long (max 15 digits)";
    }

    // Passport: alphanumeric, 5-20 chars
    const trimmedPassport = passportNumber.trim();
    if (!trimmedPassport) {
      errors.passportNumber = "Passport number is required";
    } else if (!/^[a-zA-Z0-9\-]+$/.test(trimmedPassport)) {
      errors.passportNumber = "Passport number can only contain letters, digits, and hyphens";
    } else if (trimmedPassport.length < 5) {
      errors.passportNumber = "Passport number is too short (min 5 characters)";
    } else if (trimmedPassport.length > 20) {
      errors.passportNumber = "Passport number is too long (max 20 characters)";
    }

    // Gender
    if (!gender) {
      errors.gender = "Please select a gender";
    }

    // Age: 18-100
    const ageNum = parseInt(age, 10);
    if (!age) {
      errors.age = "Age is required";
    } else if (isNaN(ageNum)) {
      errors.age = "Age must be a number";
    } else if (ageNum < 18) {
      errors.age = "Applicant must be at least 18 years old";
    } else if (ageNum > 100) {
      errors.age = "Please enter a valid age (max 100)";
    }

    // Photo
    if (!photograph) {
      errors.photograph = "A photograph is required";
    }

    // Status
    if (!formStatus || !["pending", "approved", "rejected"].includes(formStatus)) {
      errors.status = "Please select a valid status";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setSubmitting(true);
    const digitsOnly = phoneLocal.replace(/[\s\-()]/g, "");
    const fullPhone = `${countryCode} ${digitsOnly}`;

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: fullPhone,
          passportNumber: passportNumber.trim().toUpperCase(),
          gender,
          photograph,
          age,
          status: formStatus,
        }),
      });

      if (res.ok) {
        setSuccess("Applicant added successfully!");
        resetForm();
        setFormOpen(false);
        fetchEmployees();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add applicant");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchEmployees();
    } catch {
      /* status update error handled silently */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this applicant?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) fetchEmployees();
    } catch {
      /* delete error handled silently */
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getColors = (status: string) => STATUS_COLORS[status] || STATUS_COLORS.pending;

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
      hasError
        ? "border-red-400 focus:ring-red-300 bg-red-50/50"
        : "border-gray-300 focus:ring-mccain-green"
    }`;

  return (
    <div className="min-h-screen bg-mccain-gray">
      {/* Top bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-mccain-dark">
            Admin Dashboard<span className="text-mccain-yellow">.</span>
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-mccain-green hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Status summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { key: "all", label: "Total", color: "bg-white border-mccain-green", text: "text-mccain-green" },
            { key: "pending", label: "Pending", color: "bg-yellow-50 border-yellow-400", text: "text-yellow-700" },
            { key: "approved", label: "Approved", color: "bg-green-50 border-green-500", text: "text-green-700" },
            { key: "rejected", label: "Rejected", color: "bg-red-50 border-red-500", text: "text-red-700" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${item.color} ${
                statusFilter === item.key ? "ring-2 ring-offset-1 ring-mccain-green shadow-md scale-[1.02]" : "hover:shadow-sm"
              }`}
            >
              <p className={`text-2xl md:text-3xl font-bold ${item.text}`}>
                {statusCounts[item.key as keyof typeof statusCounts]}
              </p>
              <p className="text-xs font-semibold text-mccain-gray-dark uppercase tracking-wide mt-1">
                {item.label}
              </p>
            </button>
          ))}
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {/* Add Applicant Toggle */}
        <button
          onClick={() => {
            setFormOpen(!formOpen);
            if (!formOpen) resetForm();
          }}
          className="mb-6 bg-mccain-green hover:bg-mccain-green-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {formOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            )}
          </svg>
          {formOpen ? "Cancel" : "Add Applicant"}
        </button>

        {/* Add Applicant Form */}
        {formOpen && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <h2 className="text-lg font-bold text-mccain-dark mb-1">
              New Applicant<span className="text-mccain-yellow">.</span>
            </h2>
            <p className="text-xs text-mccain-gray-dark mb-5">Fields marked with * are required</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: undefined }));
                    }}
                    placeholder="e.g. John Doe"
                    className={inputClass(!!fieldErrors.fullName)}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone Number with Country Code */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Phone Number *</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`w-[130px] flex-shrink-0 px-2 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white ${
                        fieldErrors.phoneNumber ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-mccain-green"
                      }`}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.country}-${c.code}`} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneLocal}
                      onChange={(e) => {
                        // Only allow digits, spaces, hyphens, parens
                        const val = e.target.value.replace(/[^\d\s\-()]/g, "");
                        setPhoneLocal(val);
                        if (fieldErrors.phoneNumber) setFieldErrors((p) => ({ ...p, phoneNumber: undefined }));
                      }}
                      placeholder="234 567 890"
                      className={`flex-1 min-w-0 ${inputClass(!!fieldErrors.phoneNumber)}`}
                    />
                  </div>
                  {fieldErrors.phoneNumber ? (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.phoneNumber}
                    </p>
                  ) : (
                    <p className="mt-1 text-[10px] text-mccain-gray-dark">Select country code, then enter local number</p>
                  )}
                </div>

                {/* Passport Number */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Passport Number *</label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => {
                      setPassportNumber(e.target.value.toUpperCase());
                      if (fieldErrors.passportNumber) setFieldErrors((p) => ({ ...p, passportNumber: undefined }));
                    }}
                    placeholder="e.g. AB1234567"
                    maxLength={20}
                    className={`${inputClass(!!fieldErrors.passportNumber)} uppercase tracking-wider font-mono`}
                  />
                  {fieldErrors.passportNumber ? (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.passportNumber}
                    </p>
                  ) : (
                    <p className="mt-1 text-[10px] text-mccain-gray-dark">Letters, digits, and hyphens only (5-20 chars)</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (fieldErrors.gender) setFieldErrors((p) => ({ ...p, gender: undefined }));
                    }}
                    className={`${inputClass(!!fieldErrors.gender)} bg-white`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.gender && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.gender}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (fieldErrors.age) setFieldErrors((p) => ({ ...p, age: undefined }));
                    }}
                    placeholder="e.g. 25"
                    min={18}
                    max={100}
                    className={inputClass(!!fieldErrors.age)}
                  />
                  {fieldErrors.age ? (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.age}
                    </p>
                  ) : (
                    <p className="mt-1 text-[10px] text-mccain-gray-dark">Must be between 18 and 100</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => {
                      setFormStatus(e.target.value);
                      if (fieldErrors.status) setFieldErrors((p) => ({ ...p, status: undefined }));
                    }}
                    className={`${inputClass(!!fieldErrors.status)} bg-white`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {fieldErrors.status && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.status}
                    </p>
                  )}
                </div>

                {/* Photograph */}
                <div>
                  <label className="block text-sm font-semibold text-mccain-dark mb-1">Photograph *</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handlePhotoChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-mccain-green file:text-white hover:file:bg-mccain-green-dark ${
                      fieldErrors.photograph ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-mccain-green"
                    }`}
                  />
                  {fieldErrors.photograph ? (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      {fieldErrors.photograph}
                    </p>
                  ) : (
                    <p className="mt-1 text-[10px] text-mccain-gray-dark">PNG, JPG, or WebP. Max 5MB.</p>
                  )}
                </div>
              </div>

              {/* Photo preview */}
              {photoPreview && (
                <div className="flex items-center gap-3 p-3 bg-mccain-gray rounded-lg">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-mccain-green">
                    <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-mccain-dark">Photo uploaded</p>
                    <p className="text-xs text-mccain-gray-dark">Preview of the applicant&apos;s photograph</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-mccain-green hover:bg-mccain-green-dark disabled:bg-mccain-green/60 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Adding...
                    </>
                  ) : (
                    "Add Applicant"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); resetForm(); }}
                  className="text-sm font-semibold text-mccain-gray-dark hover:text-mccain-dark transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Applicant List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-bold text-mccain-dark">
                Applicants<span className="text-mccain-yellow">.</span>
                <span className="text-sm font-normal text-mccain-gray-dark ml-2">
                  ({filteredEmployees.length}{statusFilter !== "all" || searchQuery ? ` of ${employees.length}` : ""})
                </span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mccain-gray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mccain-green focus:border-transparent"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-mccain-gray-dark hover:text-mccain-dark">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              <div className="flex gap-1 bg-mccain-gray rounded-lg p-1 flex-shrink-0">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => {
                  const isActive = statusFilter === status;
                  const dotColor = status === "all" ? "bg-mccain-green" : (STATUS_COLORS[status]?.dot || "bg-gray-400");
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                        isActive ? "bg-white shadow-sm text-mccain-dark" : "text-mccain-gray-dark hover:text-mccain-dark"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-mccain-gray-dark">Loading...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-mccain-gray-dark">
              {employees.length === 0
                ? 'No applicants yet. Click "Add Applicant" to get started.'
                : "No applicants match your search or filter."}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-mccain-gray/50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Photo</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Full Name</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Phone</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Passport</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Gender</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Age</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-mccain-dark uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((emp) => {
                      const colors = getColors(emp.status);
                      return (
                        <tr key={emp.id} className={`transition-colors ${colors.row}`}>
                          <td className="px-4 py-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-mccain-gray">
                              <Image src={emp.photograph} alt={emp.fullName} fill className="object-cover" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-mccain-dark">{emp.fullName}</td>
                          <td className="px-4 py-3 text-sm text-mccain-gray-dark">{emp.phoneNumber}</td>
                          <td className="px-4 py-3 text-sm text-mccain-gray-dark font-mono">{emp.passportNumber}</td>
                          <td className="px-4 py-3 text-sm text-mccain-gray-dark">{emp.gender}</td>
                          <td className="px-4 py-3 text-sm text-mccain-gray-dark">{emp.age}</td>
                          <td className="px-4 py-3">
                            <select
                              value={emp.status}
                              onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                              className={`text-xs font-semibold border rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-mccain-green ${colors.badge}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(emp.id)} className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline">
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredEmployees.map((emp) => {
                  const colors = getColors(emp.status);
                  return (
                    <div key={emp.id} className={`p-4 transition-colors ${colors.row}`}>
                      <div className="flex items-start gap-3">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-mccain-gray flex-shrink-0">
                          <Image src={emp.photograph} alt={emp.fullName} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-mccain-dark">{emp.fullName}</h3>
                          <p className="text-xs text-mccain-gray-dark">{emp.gender} &middot; Age {emp.age}</p>
                          <p className="text-xs text-mccain-gray-dark">{emp.phoneNumber}</p>
                          <p className="text-xs text-mccain-gray-dark font-mono">Passport: {emp.passportNumber}</p>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <select
                              value={emp.status}
                              onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                              className={`text-xs font-semibold border rounded-full px-3 py-1 focus:outline-none ${colors.badge}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button onClick={() => handleDelete(emp.id)} className="text-xs text-red-600 hover:text-red-800 font-semibold">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
