//import * as tf from '@tensorflow/tfjs';
//import * as cocoSsd from '@tensorflow-models/coco-ssd';
// import { Injectable, Logger } from '@nestjs/common';
// import path from 'path';
// import * as fs from 'fs';
// import { createCanvas, loadImage } from '@napi-rs/canvas';
// import { PrismaService } from '@prisma/prisma.service';
// import fetch from 'node-fetch';
// globalThis.fetch = fetch;

// import * as tf from '@tensorflow/tfjs';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';

// @Injectable()

// export class RecognizeService {
//   private model: cocoSsd.ObjectDetection | null = null;
//   private readonly logger = new Logger(RecognizeService.name);
//   private readonly modelPath = path.resolve('./models/coco-ssd/model.json');

//   constructor(private readonly prisma: PrismaService) {

//     console.log('🔹 RecognizeService создан');


// console.log('RecognizeService инициализирован, prisma:', this.prisma ? '✅ есть' : '❌ undefined');

// }
//   // Загружаем модель один раз
//   async loadModel() {
//     if (!this.model) {
//       if (!fs.existsSync(this.modelPath)) {
//         throw new Error(`Модель не найдена по пути ${this.modelPath}. Скачай её сначала.`);
//       }
//       this.logger.log('Загрузка локальной COCO-SSD модели...');
//       this.model = await cocoSsd.load({
//         modelUrl: `file://${this.modelPath}`,
//         base: 'lite_mobilenet_v2',
//       });
//       this.logger.log('Локальная COCO-SSD модель загружена');
//     }
//     return this.model;
//   }

//   async recognize(imageBuffer: Buffer) {
//     const model = await this.loadModel();

//     // Загружаем изображение через canvas
//     const img = await loadImage(imageBuffer);
//     const canvas = createCanvas(img.width, img.height);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0);
// //@ts-ignore
//     // Преобразуем в Tensor3D (RGB)
//     let imageTensor = tf.browser.fromPixels(canvas);

//     // Получаем предсказания
//     const predictions = await model.detect(imageTensor as tf.Tensor3D);

//     // Освобождаем память
//     imageTensor.dispose();

//     return predictions;
//   }
// }
import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

@Injectable()
export class RecognizeService {
  private model: cocoSsd.ObjectDetection | null = null;
  private readonly logger = new Logger(RecognizeService.name);

  private readonly modelUrl = 'https://ai-chef-seven.vercel.app/models/coco-ssd/model.json';
//curl https://ai-chef-seven.vercel.app/models/coco-ssd/model.json

  // Загружаем модель один раз
  async loadModel() {
    if (!this.model) {
      this.logger.log('Загрузка COCO-SSD модели по URL...');
      this.model = await cocoSsd.load({
        modelUrl: this.modelUrl,
        base: 'lite_mobilenet_v2',
      });
      this.logger.log('Модель загружена');
    }
    return this.model;
  }

  async recognize(imageBuffer: Buffer) {
    const model = await this.loadModel();

    // используем @napi-rs/canvas
    const { createCanvas, loadImage } = await import('@napi-rs/canvas');
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    //@ts-ignore
    const imageTensor = tf.browser.fromPixels(canvas);

    const predictions = await model.detect(imageTensor as tf.Tensor3D);
    imageTensor.dispose();
    return predictions;
  }
}
