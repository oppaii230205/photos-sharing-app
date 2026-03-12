"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { App, Spin, Popconfirm } from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
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
        <Spin size="large" />
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Photo not found</h2>
        <p className="text-gray-500">
          This photo may have been deleted or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-primary hover:text-indigo-700 font-medium"
        >
          Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <ArrowLeftOutlined />
        Back to gallery
      </Link>

      {/* Photo */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="relative w-full bg-gray-100">
          <img
            src={photo.url}
            alt={photo.caption || photo.originalName}
            className="w-full max-h-[70vh] object-contain"
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Caption & meta */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              {photo.caption && (
                <h1 className="text-lg font-semibold text-gray-900 mb-1">
                  {photo.caption}
                </h1>
              )}
              <p className="text-sm text-gray-400">
                {photo.originalName} &middot; {formatTimeAgo(photo.createdAt)}
              </p>
            </div>

            <Popconfirm
              title="Delete this photo?"
              description="This action cannot be undone."
              onConfirm={handleDelete}
              okText="Delete"
              okType="danger"
            >
              <button className="text-gray-300 hover:text-red-500 transition-colors text-lg flex-shrink-0">
                <DeleteOutlined />
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Comments</h2>
        <CommentSection photoId={photo.id} initialComments={photo.comments} />
      </div>
    </div>
  );
}
