"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { App, Spin, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import type { PhotoDetail } from "@/types";
import { photoApi } from "@/services/photoApi";
import { formatTimeAgo } from "@/lib/utils";
import CommentSection from "@/components/CommentSection";

export default function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { message } = App.useApp();
  const router = useRouter();
  const [photo, setPhoto] = useState<PhotoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    photoApi
      .getById(id)
      .then((data) => {
        if (data) setPhoto(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await photoApi.delete(id);
      message.success("Photo deleted");
      router.push("/");
    } catch {
      message.error("Failed to delete photo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spin />
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-[15px] font-medium text-gray-700">Photo not found</p>
        <p className="text-[13px] text-gray-400">
          This photo may have been deleted.
        </p>
        <Link
          href="/"
          className="text-[13px] text-indigo-600 hover:text-indigo-700 font-medium mt-1"
        >
          ← Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            fillRule="evenodd"
            d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </Link>

      {/* Split layout: image left, comments right */}
      <div className="flex flex-col lg:flex-row bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm lg:max-h-[calc(100vh-120px)]">
        {/* ── Left: photo ───────────────────────────────────────────────── */}
        <div className="lg:flex-1 bg-gray-950 flex items-center justify-center min-h-[260px]">
          <img
            src={photo.url}
            alt={photo.caption || photo.originalName}
            className="max-h-[60vh] lg:max-h-[calc(100vh-120px)] w-full lg:w-auto object-contain"
          />
        </div>

        {/* ── Right: meta + comments ────────────────────────────────────── */}
        <div className="lg:w-[360px] flex-shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 lg:overflow-hidden">
          {/* Photo meta header */}
          <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {photo.caption && (
                  <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                    {photo.caption}
                  </p>
                )}
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {photo.originalName}&nbsp;&middot;&nbsp;
                  {formatTimeAgo(photo.createdAt)}
                </p>
              </div>
              <Popconfirm
                title="Delete this photo?"
                onConfirm={handleDelete}
                okText="Delete"
                okType="danger"
                placement="bottomRight"
              >
                <button className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.711z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Popconfirm>
            </div>
          </div>

          {/* Comment section — fills remaining height, handles its own scroll */}
          <div className="flex-1 lg:overflow-y-auto lg:min-h-0">
            <CommentSection
              photoId={photo.id}
              initialComments={photo.comments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
