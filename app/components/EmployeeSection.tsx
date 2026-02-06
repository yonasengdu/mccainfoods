"use client";

import { useState, useEffect, useMemo } from "react";
import EmployeeCard from "@/app/components/EmployeeCard";

interface Employee {
  id: string;
  fullName: string;
  phoneNumber: string;
  passportNumber: string;
  gender: string;
  photograph: string;
  age: number;
  status: string;
}

export default function EmployeeSection() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees");
        const data = await res.json();
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      } catch {
        /* fetch error handled silently */
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const visibleEmployees = useMemo(() => {
    if (activeFilter === "all") return employees;
    return employees.filter((e) => e.status === activeFilter);
  }, [employees, activeFilter]);

  const counts = useMemo(() => {
    const c = { all: employees.length, pending: 0, approved: 0, rejected: 0 };
    employees.forEach((e) => {
      if (e.status in c) c[e.status as keyof typeof c]++;
    });
    return c;
  }, [employees]);

  if (loading) return null;
  if (employees.length === 0) return null;

  return (
    <section className="bg-mccain-gray/50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-mccain-dark">
              Application Status<span className="text-mccain-yellow">.</span>
            </h2>
            <p className="text-mccain-gray-dark mt-1">Applicants and their current status</p>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "approved", "rejected"] as const).map((filter) => {
              const isActive = activeFilter === filter;
              const dotColors: Record<string, string> = {
                all: "bg-mccain-green",
                pending: "bg-amber-400",
                approved: "bg-emerald-500",
                rejected: "bg-red-500",
              };
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-mccain-green text-white shadow-md"
                      : "bg-white text-mccain-gray-dark border border-gray-200 hover:border-mccain-green hover:text-mccain-green"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : dotColors[filter]}`} />
                  {filter} ({counts[filter as keyof typeof counts]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        {visibleEmployees.length === 0 ? (
          <p className="text-center text-mccain-gray-dark py-8">No applicants match this filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                fullName={employee.fullName}
                passportNumber={employee.passportNumber}
                gender={employee.gender}
                photograph={employee.photograph}
                status={employee.status}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
