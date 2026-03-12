"use client";

import React from "react";
import Link from "next/link";
import { MessageOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popconfirm, message } from "antd";
import type { PhotoListItem } from "@/types";
import { formatTimeAgo } from "@/lib/utils";
import { photoApi } from "@/services/photoApi";

interface PhotoCardProps {
  photo: PhotoListItem;
  onDeleted?: () => void;
}

export default function PhotoCard({ photo, onDeleted }: PhotoCardProps) {
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.06)] hover:-translate-y-1">
      {/* Image — links to detail page */}
      <Link href={`/photos/${photo.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={photo.url}
            alt={photo.caption || photo.originalName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Caption & time */}
        <div className="mb-4">
          {photo.caption && (
            <p className="text-[14px] text-gray-800 font-medium leading-snug line-clamp-2">
              {photo.caption}
            </p>
          )}
          <span className="text-[11px] font-medium text-gray-400 mt-1.5 tracking-wider uppercase block">
            {formatTimeAgo(photo.createdAt)}
          </span>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gray-50 mb-4"></div>

        {/* Footer: comment count + delete */}
        <div className="flex items-center justify-between mt-auto">
          <Link
            href={`/photos/${photo.id}`}
            className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-[13px]"
          >
            <MessageOutlined />
            <span>
              {photo._count.comments}{" "}
              {photo._count.comments === 1 ? "comment" : "comments"}
            </span>
          </Link>

          <Popconfirm
            title="Delete this photo?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Delete"
            okType="danger"
          >
            <button className="text-gray-300 hover:text-red-500 transition-colors text-[15px]">
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}
