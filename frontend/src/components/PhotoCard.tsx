"use client";

import React, { useState } from "react";
import { Avatar } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import CommentSection from "./CommentSection";

interface PhotoCardProps {
  photo: any;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-[0_12px_24px_rgb(0,0,0,0.06)] hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={photo.url}
          alt="Upload"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* User Info & Actions */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Avatar
              src={photo.user.avatar}
              size={36}
              className="border border-gray-100"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-[14px] text-gray-900 leading-tight">
                {photo.user.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 mt-0.5 tracking-wider uppercase">
                {photo.user.time}
              </span>
            </div>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className={`text-xl transition-colors focus:outline-none ${liked ? "text-rose-500 hover:text-rose-600" : "text-slate-300 hover:text-rose-400"}`}
          >
            {liked ? (
              <HeartFilled />
            ) : (
              <HeartOutlined className="stroke-[1.5]" />
            )}
          </button>
        </div>

        {/* Divider - thin and subtle */}
        <div className="h-[1px] w-full bg-gray-50 mb-5"></div>

        {/* Comments Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <CommentSection initialComments={photo.comments} />
        </div>
      </div>
    </div>
  );
}
