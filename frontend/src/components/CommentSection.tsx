"use client";

import React, { useState, useEffect, useCallback } from "react";
import { App, Spin } from "antd";
import type { Comment, PaginationMeta } from "@/types";
import { commentApi } from "@/services/commentApi";
import { formatTimeAgo, getAvatarUrl } from "@/lib/utils";

interface CommentSectionProps {
  photoId: string;
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
      if (newComment) setComments((prev) => [...prev, newComment]);
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
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Comment list */}
      <div className="flex-1 px-5 py-4 space-y-5 overflow-y-auto min-h-0">
        {comments.length === 0 && (
          <p className="text-[13px] text-gray-400 py-4">
            No comments yet. Be the first!
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 items-start group">
            <img
              src={getAvatarUrl(comment.author)}
              alt={comment.author}
              className="w-7 h-7 rounded-full border border-gray-100 flex-shrink-0 mt-0.5 bg-gray-50"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[13px] font-semibold text-gray-800 leading-none">
                  {comment.author}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] text-gray-400">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                    aria-label="Delete comment"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M5 1a1 1 0 00-1 1H2.5a.5.5 0 000 1H3v5.5A1.5 1.5 0 004.5 10h3A1.5 1.5 0 009 8.5V3h.5a.5.5 0 000-1H8a1 1 0 00-1-1H5zm0 1h2v.5a.5.5 0 00.5.5h.5v5.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V3h.5a.5.5 0 00.5-.5V2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug break-words">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {meta && meta.page < meta.totalPages && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-[12px] text-gray-400 hover:text-indigo-600 transition-colors font-medium"
          >
            {loadingMore ? "Loading…" : "Load more comments"}
          </button>
        )}
      </div>

      {/* Sticky composer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 space-y-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          className="w-full text-[13px] bg-gray-50 border border-transparent rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-indigo-50 transition-all placeholder-gray-400 text-gray-700"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && !posting && handlePost()
            }
            maxLength={1000}
            className="flex-1 text-[13px] bg-gray-50 border border-transparent rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-indigo-50 transition-all placeholder-gray-400 text-gray-700"
          />
          <button
            onClick={handlePost}
            disabled={!content.trim() || posting}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {posting ? "…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
