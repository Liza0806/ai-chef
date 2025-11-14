import { Module } from '@nestjs/common';;
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecognizeModule } from './recognize/recognize.module';
import { UploadModule } from './upload/upload.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// @Module({
//   imports: [RecognizeModule, UploadModule, RecipesModule, UsersModule, ServeStaticModule.forRoot({
//       rootPath: join(__dirname, '..', 'models'), // указываем папку моделей
//       serveRoot: '/models',                       // по какому URL они доступны
//     })],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'), // путь к src/models после сборки
      serveRoot: '/models', // URL: http://localhost:3000/models/...
    }),
    RecognizeModule,
  ],
})
export class AppModule {}
