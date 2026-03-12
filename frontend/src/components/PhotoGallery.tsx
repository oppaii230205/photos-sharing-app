"use client";

import React, { useState, useEffect, useCallback } from "react";
import PhotoCard from "./PhotoCard";
import { Button, Spin } from "antd";
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
      // silently fail — empty state shown
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
    // Re-fetch from page 1 to get correct state
    setLoading(true);
    fetchPhotos(1).finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 w-full shadow-sm mt-2">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-primary/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No photos yet</h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm">
            Be the first to share a moment with the community. Upload your first
            photo above!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onDeleted={handlePhotoDeleted}
              />
            ))}
          </div>

          {meta && meta.page < meta.totalPages && (
            <Button
              shape="round"
              size="large"
              loading={loadingMore}
              onClick={handleLoadMore}
              className="mt-10 px-10 h-11 font-medium text-gray-700 hover:text-gray-900 border-gray-200 shadow-sm"
            >
              Load More
            </Button>
          )}
        </>
      )}
    </div>
  );
}
