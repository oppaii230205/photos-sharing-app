import { Request, Response, NextFunction } from "express";
import { PhotoService } from "../services/photo.service";

const photoService = new PhotoService();

export class PhotoController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const photos = await photoService.findAll();
      res.json(photos);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const photo = await photoService.findById(req.params.id);
      if (!photo) {
        res.status(404).json({ error: "Photo not found" });
        return;
      }
      res.json(photo);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const photo = await photoService.create({
        file,
        caption: req.body.caption,
      });

      res.status(201).json(photo);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await photoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
