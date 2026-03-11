"use client";

import React, { useState } from "react";
import { Avatar } from "antd";

interface CommentSectionProps {
  initialComments: any[];
}

export default function CommentSection({
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [inputValue, setInputValue] = useState("");

  const handlePost = () => {
    if (!inputValue.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      },
      text: inputValue,
      time: "Just now",
    };

    setComments([...comments, newComment]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full justify-between gap-5">
      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 items-start">
            <Avatar
              src={comment.user.avatar}
              size={28}
              className="flex-shrink-0 mt-0.5 border border-gray-100"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-[13px] text-gray-800">
                  {comment.user.name}
                </span>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {comment.time}
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mt-0.5 break-words">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="mt-auto pt-4 relative flex items-center">
        <div className="relative w-full flex items-center bg-[#F8FAFF] border mt-2 border-indigo-50/50 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all overflow-hidden">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder-gray-400 h-8"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
          />
          <button
            onClick={handlePost}
            disabled={!inputValue.trim()}
            className={`text-[13px] font-semibold transition-colors px-2 ${
              inputValue.trim()
                ? "text-primary hover:text-indigo-700"
                : "text-primary/40 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
