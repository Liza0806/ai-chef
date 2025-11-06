import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // добавляем общий префикс для всех роутов
  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();


