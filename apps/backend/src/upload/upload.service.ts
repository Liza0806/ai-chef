import { RecognizeService } from '../recognize/recognize.service';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly recognizeService: RecognizeService) {}

  async processFile(filePath: string) {
    try {
      // 👉 Передаём путь в сервис распознавания
    // 🔹 читаем файл в буфер
    const imageBuffer = await fs.readFile(filePath);

    // 🔹 передаём буфер в сервис распознавания
    const result = await this.recognizeService.recognize(imageBuffer);

      return {
        message: 'Файл успешно распознан',
        data: result,
      };
    } catch (err) {
      this.logger.error('Ошибка при обработке файла:', err);
      throw err;
    }

}
}

