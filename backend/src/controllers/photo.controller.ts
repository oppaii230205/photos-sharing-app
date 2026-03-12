import { Request, Response, NextFunction } from "express";
import { PhotoService } from "../services/photo.service";
import { ApiResponse } from "../lib/apiResponse";
import { BadRequestError, NotFoundError } from "../lib/errors";

const photoService = new PhotoService();

export class PhotoController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const photos = await photoService.findAll();
      ApiResponse.ok(res, photos, "Photos retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const photo = await photoService.findById(req.params.id);
      if (!photo) {
        throw new NotFoundError("Photo not found");
      }
      ApiResponse.ok(res, photo, "Photo retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        throw new BadRequestError("No file uploaded");
      }

      const photo = await photoService.create({
        file,
        caption: req.body.caption,
      });

      ApiResponse.created(res, photo, "Photo uploaded successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await photoService.delete(req.params.id);
      ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}
