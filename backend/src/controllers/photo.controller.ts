import { Request, Response } from "express";
import { PhotoService } from "../services/photo.service";
import { ApiResponse } from "../lib/apiResponse";
import { catchAsync } from "../lib/catchAsync";
import { BadRequestError, NotFoundError } from "../lib/errors";

const photoService = new PhotoService();

export class PhotoController {
  getAll = catchAsync(async (_req: Request, res: Response) => {
    const photos = await photoService.findAll();
    ApiResponse.ok(res, photos, "Photos retrieved successfully");
  });

  getById = catchAsync<{ id: string }>(async (req, res) => {
    const { id } = req.params;
    const photo = await photoService.findById(id);
    if (!photo) {
      throw new NotFoundError("Photo not found");
    }
    ApiResponse.ok(res, photo, "Photo retrieved successfully");
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const photo = await photoService.create({
      file,
      caption: req.body.caption,
    });

    ApiResponse.created(res, photo, "Photo uploaded successfully");
  });

  delete = catchAsync<{ id: string }>(async (req, res) => {
    await photoService.delete(req.params.id);
    ApiResponse.noContent(res);
  });
}
