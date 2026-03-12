import apiClient from "./apiClient";
import type { ApiResponse, PaginatedData, Comment } from "@/types";

export const commentApi = {
  getByPhotoId: async (photoId: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Comment>>>(
      `/comments/photo/${photoId}`,
      { params: { page, limit } },
    );
    return data.data;
  },

  create: async (photoId: string, content: string, author?: string) => {
    const { data } = await apiClient.post<ApiResponse<Comment>>("/comments", {
      photoId,
      content,
      author,
    });
    return data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/comments/${id}`);
  },
};
