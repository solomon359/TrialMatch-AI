"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface TrialImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (nctId: string) => void;
}

export default function TrialImportModal({
  isOpen,
  onClose,
  onImport,
}: TrialImportModalProps) {
  const [nctId, setNctId] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("recruiting");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!nctId.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    onImport(nctId.trim());
    setLoading(false);
    setNctId("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from ClinicalTrials.gov">
      <div className="space-y-4">
        <Input
          label="NCT ID"
          placeholder="NCT05012345"
          value={nctId}
          onChange={(e) => setNctId(e.target.value)}
        />
        <Input
          label="Condition (optional)"
          placeholder="e.g. Non-Small Cell Lung Cancer"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <Select
          label="Status Filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "recruiting", label: "Recruiting" },
            { value: "active_not_recruiting", label: "Active, Not Recruiting" },
            { value: "completed", label: "Completed" },
            { value: "all", label: "All Statuses" },
          ]}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} loading={loading} disabled={!nctId.trim()}>
            Import Trial
          </Button>
        </div>
      </div>
    </Modal>
  );
}
