import apiClient from "./apiClient";
import type {
  ApiResponse,
  PaginatedData,
  PhotoListItem,
  PhotoDetail,
} from "@/types";

export const photoApi = {
  getAll: async (page = 1, limit = 12) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedData<PhotoListItem>>
    >("/photos", { params: { page, limit } });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<PhotoDetail>>(
      `/photos/${id}`,
    );
    return data.data;
  },

  upload: async (file: File, caption?: string) => {
    const formData = new FormData();
    formData.append("photo", file);
    if (caption) {
      formData.append("caption", caption);
    }

    const { data } = await apiClient.post<ApiResponse<PhotoDetail>>(
      "/photos",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/photos/${id}`);
  },
};
