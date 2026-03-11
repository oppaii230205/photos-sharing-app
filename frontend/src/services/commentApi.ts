import apiClient from "./apiClient";
import { Comment } from "@/types";

// Comment API service
// Centralizes all comment-related API calls

export const commentApi = {
  // Add a comment to a photo
  create: async (
    photoId: string,
    content: string,
    author?: string,
  ): Promise<Comment> => {
    const response = await apiClient.post("/comments", {
      photoId,
      content,
      author,
    });
    return response.data;
  },

  // Delete a comment
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  },
};
