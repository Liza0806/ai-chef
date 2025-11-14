// import { Module } from '@nestjs/common';;
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { RecognizeModule } from './recognize/recognize.module';
// import { UploadModule } from './upload/upload.module';
// import { RecipesModule } from './recipes/recipes.module';
// import { UsersModule } from './users/users.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

// // @Module({
// //   imports: [RecognizeModule, UploadModule, RecipesModule, UsersModule, ServeStaticModule.forRoot({
// //       rootPath: join(__dirname, '..', 'models'), // указываем папку моделей
// //       serveRoot: '/models',                       // по какому URL они доступны
// //     })],
// //   controllers: [AppController],
// //   providers: [AppService],
// // })
// // export class AppModule {}

// @Module({
//   imports: [
//     ServeStaticModule.forRoot({
//       rootPath: join(__dirname, '../models'), // путь к src/models после сборки
//       serveRoot: '/models', // URL: http://localhost:3000/models/...
//     }),
//     RecognizeModule,
//   ],
// })
// export class AppModule {}
import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

@Injectable()
export class RecognizeService {
  private model: cocoSsd.ObjectDetection | null = null;
  private readonly logger = new Logger(RecognizeService.name);

  private readonly modelUrl = 'https://<твой-проект-на-vercel>/models/coco-ssd/model.json';

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
export class AppModule {}