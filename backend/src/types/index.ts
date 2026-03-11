export interface Photo {
  id: string;
  originalName: string;
  url: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  photoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePhotoInput {
  file: Express.Multer.File;
  caption?: string;
}

export interface CreateCommentInput {
  photoId: string;
  content: string;
  author?: string;
}

export interface CloudinaryUploadResponse {
  code: number;
  message: string;
  result: {
    image: string;
  };
}
