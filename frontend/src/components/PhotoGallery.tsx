"use client";

// PhotoGallery component
// Displays all uploaded photos in a responsive grid layout
//
// TODO: Implement
// - Fetch photos from API on mount
// - Use antd Row/Col or Card grid layout
// - Render PhotoCard for each photo
// - Handle empty state
// - Support refresh trigger from parent

import { Photo } from "@/types";

interface PhotoGalleryProps {
  photos: Photo[];
  loading: boolean;
}

export default function PhotoGallery({ photos, loading }: PhotoGalleryProps) {
  return (
    <div>
      {/* TODO: Implement responsive photo grid with PhotoCard components */}
    </div>
  );
}
