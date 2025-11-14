// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api'); // добавляем общий префикс для всех роутов
//   await app.listen(3000);
//   console.log('🚀 Server running on http://localhost:3000');
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальный префикс
  app.setGlobalPrefix('api');

  // 🔥 Раздача моделей TensorFlow (для tfjs)
  const modelsPath = path.join(__dirname, '..', 'models');
  console.log('📁 Static models path:', modelsPath);

  app.use('/models', express.static(modelsPath));

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
