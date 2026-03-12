"use client";

import React, { useState, useEffect, useCallback } from "react";
import PhotoCard from "./PhotoCard";
import type { PhotoListItem, PaginationMeta } from "@/types";
import { photoApi } from "@/services/photoApi";

export default function PhotoGallery() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [photos, setPhotos] = useState<PhotoListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const fetchPhotos = useCallback(async (page: number, append = false) => {
    try {
      const result = await photoApi.getAll(page);
      if (!result) return;
      setPhotos((prev) => (append ? [...prev, ...result.items] : result.items));
      setMeta(result.meta);
    } catch {
      // silently — empty state shown below
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPhotos(1).finally(() => setLoading(false));
  }, [fetchPhotos]);

  const handleLoadMore = async () => {
    if (!meta || meta.page >= meta.totalPages) return;
    setLoadingMore(true);
    await fetchPhotos(meta.page + 1, true);
    setLoadingMore(false);
  };

  const handlePhotoDeleted = () => {
    setLoading(true);
    fetchPhotos(1).finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
            <div className="px-4 py-3 space-y-2">
              <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 w-full">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-gray-700">No photos yet</p>
          <p className="text-[13px] text-gray-400 mt-1">
            Upload your first photo above to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onDeleted={handlePhotoDeleted}
              />
            ))}
          </div>

          {meta && meta.page < meta.totalPages && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mt-10 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more photos"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
