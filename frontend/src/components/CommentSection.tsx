"use client";

// CommentSection component
// Displays comments for a photo and allows adding new comments
//
// TODO: Implement
// - List existing comments with author and timestamp
// - Use antd List component for comment display
// - Add comment form with antd Input.TextArea and Button
// - Optional author name input
// - Call commentApi.create() on submit
// - Refresh comments after successful submit

import { Comment } from "@/types";

interface CommentSectionProps {
  photoId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function CommentSection({
  photoId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  return <div>{/* TODO: Implement comment list and add-comment form */}</div>;
}
