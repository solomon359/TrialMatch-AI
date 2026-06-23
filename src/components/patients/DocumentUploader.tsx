"use client";

import React, { useCallback, useState } from "react";
import Button from "@/components/ui/Button";

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void;
  uploading?: boolean;
}

export default function DocumentUploader({
  onUpload,
  uploading = false,
}: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onUpload(files);
    },
    [onUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onUpload(files);
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-8 text-center
        transition-all duration-200 cursor-pointer
        ${
          dragActive
            ? "border-accent-blue bg-accent-blue/5"
            : "border-border-theme hover:border-border-active/50"
        }
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.csv"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl">📁</span>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {dragActive
              ? "Drop files here..."
              : "Drag & drop documents or click to browse"}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Supports PDF, DOC, DOCX, TXT, CSV
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("file-upload")?.click();
          }}
        >
          Select Files
        </Button>
      </div>
    </div>
  );
}
