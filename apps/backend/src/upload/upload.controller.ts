import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecognizeService } from '../recognize/recognize.service';
import { extname } from 'path';
import * as multer from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly recognizeService: RecognizeService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // лимит 5 МБ
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    try {
      console.log('Файл получен:', file.originalname, file.size);

      // передаем буфер прямо в сервис распознавания
      const predictions = await this.recognizeService.recognize(file.buffer);

      return { success: true, predictions };
    } catch (err) {
      console.error('Ошибка распознавания:', err);
      //@ts-ignore
      return { error: 'Internal server error', details: err.message };
    }
  }
}
