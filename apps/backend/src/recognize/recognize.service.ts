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
import * as tf from '@tensorflow/tfjs';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { Injectable, Logger } from '@nestjs/common';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as fs from 'fs';
import path from 'path';
//@ts-ignore
const fetch = (...args: any[]) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// обязательно до tfjs:
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
}

@Injectable()
export class RecognizeService {
  private model: cocoSsd.ObjectDetection | null = null;
  private readonly logger = new Logger(RecognizeService.name);
  private readonly modelPath = path.resolve('./src/models/coco-ssd/model.json');

  async loadModel() {
    if (!this.model) {
      if (!fs.existsSync(this.modelPath)) {
        throw new Error(`Модель не найдена по пути ${this.modelPath}`);
      }
      this.logger.log('Загрузка модели...');
      this.model = await cocoSsd.load({
        base: 'lite_mobilenet_v2',
        modelUrl: `file://${this.modelPath}`,
      });
      this.logger.log('Модель загружена ✅');
    }
    return this.model;
  }

  async recognize(imageBuffer: Buffer) {
    const model = await this.loadModel();

    // Загружаем изображение
    const img = await loadImage(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Получаем пиксели из канваса
    const imageData = ctx.getImageData(0, 0, img.width, img.height);

    // Преобразуем в Tensor вручную (RGB)
    const imageTensor = tf.tensor3d(
      new Uint8Array(imageData.data),
      [img.height, img.width, 4], // RGBA
      'int32'
    );

    // Если нужно убрать альфа-канал:
    const rgbTensor = imageTensor.slice([0, 0, 0], [-1, -1, 3]);

    const predictions = await model.detect(rgbTensor as tf.Tensor3D);

    imageTensor.dispose();
    rgbTensor.dispose();

    return predictions;
  }
}
