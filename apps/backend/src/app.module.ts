import { Module } from '@nestjs/common';;
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecognizeModule } from './recognize/recognize.module';
import { UploadModule } from './upload/upload.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RecognizeModule, UploadModule, RecipesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

