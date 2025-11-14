import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                   const extension = extname(file.originalname); // ✅ получаем расширение, включая точку (.jpg)
          cb(null, `${uniqueSuffix}${extension}`); 
          console.log("сделали файлу имя")
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file){ 
           console.log("файл не загружен в аплоад файл")
      throw new BadRequestException('Файл не загружен')};

    try {
      const result = await this.uploadService.processFile(file.path);
           console.log("загрузили, вот результат:", result)
      return { success: true, result };
    }
     finally {
      console.log("finally в аплоад")
      // // Контроллер отвечает за удаление файла
      // fs.unlink(file.path, (err) => {
      //   if (err) console.error('Не удалось удалить файл:', err);
      // });
    }
  }
}
