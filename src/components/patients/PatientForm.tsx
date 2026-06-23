"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface PatientFormProps {
  onSubmit: (data: {
    mrn: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    sex: string;
    notes: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function PatientForm({
  onSubmit,
  onCancel,
  loading = false,
}: PatientFormProps) {
  const [formData, setFormData] = useState({
    mrn: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    sex: "Male",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="MRN"
        placeholder="MRN-2024-XXX"
        value={formData.mrn}
        onChange={(e) => setFormData({ ...formData, mrn: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
          required
        />
        <Input
          label="Last Name"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date of Birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) =>
            setFormData({ ...formData, date_of_birth: e.target.value })
          }
          required
        />
        <Select
          label="Sex"
          value={formData.sex}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg bg-bg-secondary border border-border-theme text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active focus:ring-1 focus:ring-accent-blue/30 transition-colors duration-200 resize-none"
          placeholder="Clinical notes..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Patient
        </Button>
      </div>
    </form>
  );
}
