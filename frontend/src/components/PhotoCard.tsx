"use client";

// PhotoCard component
// Displays a single photo thumbnail with caption and comment count
//
// TODO: Implement
// - Use antd Card component
// - Show photo thumbnail image
// - Display caption (if any)
// - Show comment count
// - Link to photo detail page or open inline comments

import { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <div>{/* TODO: Implement card with photo preview and metadata */}</div>
  );
}
