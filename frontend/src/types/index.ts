// Shared TypeScript types for the frontend

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  caption?: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  photoId: string;
  createdAt: string;
  updatedAt: string;
}
