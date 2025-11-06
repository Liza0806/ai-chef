// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';
import { RecognizeModule } from '../recognize/recognize.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
    imports: [MulterModule.register({}), RecognizeModule],
  controllers: [UploadController],
  providers: [UploadService, PrismaService],

})
export class UploadModule {}
