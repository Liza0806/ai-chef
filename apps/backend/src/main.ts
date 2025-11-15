// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api'); // добавляем общий префикс для всех роутов
//   await app.listen(3000);
//   console.log('🚀 Server running on http://localhost:3000');
// }
// bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as express from 'express';
// import path from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Глобальный префикс
//   app.setGlobalPrefix('api');

//   // 🔥 Раздача моделей TensorFlow (для tfjs)
//   const modelsPath = path.join(__dirname, '..', 'models');
//   console.log('📁 Static models path:', modelsPath);

//   app.use('/models', express.static(modelsPath));

//   await app.listen(3000);
//   console.log('🚀 Server running on http://localhost:3000');
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import path from 'path';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');

  // 📌 Путь к моделям TensorFlow
  const modelsPath = path.join(__dirname, '..', 'models');
  console.log('📁 Static models path:', modelsPath);

  server.use('/models', express.static(modelsPath));

  await app.init(); // ❗НЕ app.listen()

  // 🚀 Локальный запуск — только вне Vercel
  if (!process.env.VERCEL) {
    server.listen(3000, () =>
      console.log('🚀 Local: http://localhost:3000')
    );
  }
}

bootstrap();

export default server; // ❗Обязательный экспорт для Vercel
