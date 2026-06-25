"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PatientForm from "@/components/patients/PatientForm";
import { getPatients, createPatient } from "@/lib/api";
import type { Patient } from "@/lib/types";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      search === "" ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = async (data: {
    mrn: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    sex: string;
    notes: string;
  }) => {
    setAddLoading(true);
    try {
      const newPatient = await createPatient({
        ...data,
        sex: data.sex as Patient["sex"],
      });
      setPatients([...patients, newPatient]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to create patient:", error);
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading patients..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Patients</h1>
          <p className="text-sm text-text-muted mt-1">
            {patients.length} patients registered
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Patient</Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or MRN..."
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-bg-secondary border border-border-theme text-text-primary focus:outline-none focus:border-border-active"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="documents_uploaded">Docs Uploaded</option>
            <option value="extraction_in_progress">Extracting</option>
            <option value="extraction_complete">Extracted</option>
            <option value="matching_in_progress">Matching</option>
            <option value="matches_available">Matches Ready</option>
            <option value="under_review">Under Review</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full table-striped">
            <thead>
              <tr className="border-b border-border-theme">
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  MRN
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Sex
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  DOB
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Documents
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Last Updated
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => router.push(`/patients/${patient.id}`)}
                  className="border-b border-border-theme/50 hover:bg-bg-card-hover transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 text-sm font-mono text-accent-cyan">
                    {patient.mrn}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-text-primary">
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {patient.sex}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-muted font-mono">
                    {new Date(patient.date_of_birth).toLocaleDateString("en-US")}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={patient.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    📄 {patient.documents_count}
                  </td>
                  <td className="py-3 px-4 text-xs text-text-muted">
                    {new Date(patient.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/patients/${patient.id}`);
                      }}
                    >
                      View →
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-text-muted text-sm"
                  >
                    {search || statusFilter !== "all"
                      ? "No patients match your filters"
                      : "No patients registered yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
      >
        <PatientForm
          onSubmit={handleAddPatient}
          onCancel={() => setShowAddModal(false)}
          loading={addLoading}
        />
      </Modal>
    </div>
  );
}
