"use client";

import React, { useState, useCallback } from "react";
import { App } from "antd";
import { photoApi } from "@/services/photoApi";

interface PhotoUploadProps {
  onUploadSuccess: () => void;
}

export default function PhotoUpload({ onUploadSuccess }: PhotoUploadProps) {
  const { message } = App.useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      message.error("Only JPG, PNG, GIF, or WebP files are allowed.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("File must be smaller than 5 MB.");
      return false;
    }
    return true;
  };

  const selectFile = useCallback((file: File) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) selectFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
  };

  const handleShare = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await photoApi.upload(selectedFile, caption.trim() || undefined);
      message.success("Photo shared.");
      handleReset();
      onUploadSuccess();
    } catch {
      message.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCaption("");
  };

  // ── Preview / composer state ───────────────────────────────────────────────
  if (selectedFile && previewUrl) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="sm:w-52 flex-shrink-0 bg-gray-50">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-44 sm:h-full object-cover"
            />
          </div>

          {/* Form */}
          <div className="flex flex-col flex-1 p-5 gap-4">
            <div className="space-y-3">
              <p className="text-[12px] text-gray-400 truncate">
                {selectedFile.name}&nbsp;&middot;&nbsp;
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
              <textarea
                autoFocus
                placeholder="Write a caption…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full resize-none text-[14px] text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 justify-end mt-auto">
              <button
                onClick={handleReset}
                disabled={uploading}
                className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading && (
                  <svg
                    className="animate-spin w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {uploading ? "Sharing…" : "Share photo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Idle / drop zone ───────────────────────────────────────────────────────
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-3 py-10 px-6 bg-white rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
        dragging
          ? "border-indigo-400 bg-indigo-50/60"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          dragging ? "bg-indigo-100" : "bg-gray-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 transition-colors ${
            dragging ? "text-indigo-600" : "text-gray-500"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-[14px] font-medium text-gray-800">
          {dragging ? "Drop to upload" : "Share a photo"}
        </p>
        <p className="text-[13px] text-gray-400 mt-0.5">
          Drag &amp; drop or{" "}
          <span className="text-indigo-600 font-medium">browse files</span>
        </p>
      </div>

      <p className="text-[11px] text-gray-400 tracking-wide">
        PNG · JPG · GIF · WebP · max 5 MB
      </p>

      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="sr-only"
        onChange={handleInputChange}
      />
    </label>
  );
}
