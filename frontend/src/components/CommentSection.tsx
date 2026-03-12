"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Spin, App } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { Comment, PaginationMeta } from "@/types";
import { commentApi } from "@/services/commentApi";
import { formatTimeAgo, getAvatarUrl } from "@/lib/utils";

interface CommentSectionProps {
  photoId: string;
  /** Pre-loaded comments from the photo detail response (avoids an extra fetch). */
  initialComments?: Comment[];
}

export default function CommentSection({
  photoId,
  initialComments,
}: CommentSectionProps) {
  const { message } = App.useApp();
  const [comments, setComments] = useState<Comment[]>(initialComments ?? []);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(!initialComments);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posting, setPosting] = useState(false);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const fetchComments = useCallback(
    async (page: number, append = false) => {
      const result = await commentApi.getByPhotoId(photoId, page);
      if (!result) return;
      setComments((prev) =>
        append ? [...prev, ...result.items] : result.items,
      );
      setMeta(result.meta);
    },
    [photoId],
  );

  useEffect(() => {
    if (initialComments) return;
    setLoading(true);
    fetchComments(1).finally(() => setLoading(false));
  }, [fetchComments, initialComments]);

  const handleLoadMore = async () => {
    if (!meta || meta.page >= meta.totalPages) return;
    setLoadingMore(true);
    await fetchComments(meta.page + 1, true);
    setLoadingMore(false);
  };

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setPosting(true);
    try {
      const newComment = await commentApi.create(
        photoId,
        trimmed,
        author.trim() || undefined,
      );
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
      }
      setContent("");
    } catch {
      message.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentApi.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      message.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No comments yet — be the first!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 items-start group">
            <Avatar
              src={getAvatarUrl(comment.author)}
              size={28}
              className="flex-shrink-0 mt-0.5 border border-gray-100"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-[13px] text-gray-800">
                  {comment.author}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-[12px]"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mt-0.5 break-words">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load more comments */}
      {meta && meta.page < meta.totalPages && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="text-[13px] text-primary hover:text-indigo-700 font-medium self-center"
        >
          {loadingMore ? "Loading..." : "Load more comments"}
        </button>
      )}

      {/* Comment input */}
      <div className="space-y-2 pt-2 border-t border-gray-50">
        <div className="relative w-full flex items-center bg-[#F8FAFF] border border-indigo-50/50 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all overflow-hidden">
          <input
            type="text"
            placeholder="Your name (optional)"
            className="w-28 bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder-gray-400 h-8 border-r border-gray-200 pr-3 mr-3"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={50}
          />
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder-gray-400 h-8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !posting && handlePost()}
            maxLength={1000}
          />
          <button
            onClick={handlePost}
            disabled={!content.trim() || posting}
            className={`text-[13px] font-semibold transition-colors px-2 ${
              content.trim() && !posting
                ? "text-primary hover:text-indigo-700"
                : "text-primary/40 cursor-not-allowed"
            }`}
          >
            {posting ? "..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
