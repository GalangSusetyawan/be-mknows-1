import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { FileService } from "@services/files.service";
import { RequestWithUser } from "@interfaces/authentication/token.interface";

import { apiResponse } from "@utils/apiResponse";
import { HttpException } from '@/exceptions/HttpException';

export class FileController {
  private file = Container.get(FileService);

  public uploadFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const image = req.file as Express.Multer.File;
    const user_id = req.user.pk as number;

    if (!image) throw new HttpException(false, 400, "File is required");

    const response = await this.file.uploadSingleFile(user_id, image);
    res.status(201).json(apiResponse(201, "OK", "Upload Success", response));
  });

  public getFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const response = await this.file.getFile(id);
    res.status(200).json(apiResponse(200, "OK", "Get File Success", response));
  });

  public getFileMine = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const response = await this.file.getUserFiles(user_id);

    res.status(200).json(apiResponse(200, "OK", "Get Files Success", response));
  });
}