import apiClient from "./apiClient";
import { Photo } from "@/types";

// Photo API service
// Centralizes all photo-related API calls

export const photoApi = {
  // Get all photos with their comments
  getAll: async (): Promise<Photo[]> => {
    const response = await apiClient.get("/photos");
    return response.data;
  },

  // Get a single photo by ID
  getById: async (id: string): Promise<Photo> => {
    const response = await apiClient.get(`/photos/${id}`);
    return response.data;
  },

  // Upload a new photo
  upload: async (file: File, caption?: string): Promise<Photo> => {
    const formData = new FormData();
    formData.append("photo", file);
    if (caption) {
      formData.append("caption", caption);
    }

    const response = await apiClient.post("/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete a photo
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/photos/${id}`);
  },
};
