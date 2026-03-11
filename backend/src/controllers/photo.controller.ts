import { Request, Response, NextFunction } from "express";
import { PhotoService } from "../services/photo.service";

const photoService = new PhotoService();

export class PhotoController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement - fetch all photos with comments
      const photos = await photoService.findAll();
      res.json(photos);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement - fetch single photo by id
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
      // TODO: Implement - create photo with uploaded file
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const photo = await photoService.create({
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        caption: req.body.caption,
      });
      res.status(201).json(photo);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement - delete photo
      await photoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
