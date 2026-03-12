"use client";

import React from "react";
import Link from "next/link";
import { App, Popconfirm } from "antd";
import type { PhotoListItem } from "@/types";
import { formatTimeAgo } from "@/lib/utils";
import { photoApi } from "@/services/photoApi";

interface PhotoCardProps {
  photo: PhotoListItem;
  onDeleted?: () => void;
}

export default function PhotoCard({ photo, onDeleted }: PhotoCardProps) {
  const { message } = App.useApp();

  const handleDelete = async () => {
    try {
      await photoApi.delete(photo.id);
      message.success("Photo deleted");
      onDeleted?.();
    } catch {
      message.error("Failed to delete photo");
    }
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-visible border border-gray-100 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5">
      {/* Delete — renders above image, outside the Link */}
      <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Popconfirm
          title="Delete this photo?"
          onConfirm={handleDelete}
          okText="Delete"
          okType="danger"
          placement="bottomRight"
        >
          <button className="w-7 h-7 bg-white/90 backdrop-blur-[2px] rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
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

      {/* Image */}
      <Link
        href={`/photos/${photo.id}`}
        className="block rounded-t-xl overflow-hidden"
      >
        <div className="aspect-[4/3] bg-gray-50">
          <img
            src={photo.url}
            alt={photo.caption || photo.originalName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 rounded-t-xl bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </Link>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {photo.caption ? (
            <p className="text-[13px] font-medium text-gray-800 truncate leading-snug">
              {photo.caption}
            </p>
          ) : (
            <p className="text-[13px] text-gray-400 truncate leading-snug">
              {photo.originalName}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-0.5">
            {formatTimeAgo(photo.createdAt)}
          </p>
        </div>

        <Link
          href={`/photos/${photo.id}`}
          className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {photo._count.comments}
        </Link>
      </div>
    </div>
  );
}
