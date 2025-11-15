import { Module } from '@nestjs/common';
import { RecognizeController } from './recognize.controller';
import {RecognizeService} from './recognize.service';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import  { PrismaModule } from "../prisma/prisma.module" ;


@Module({
  
   imports: [PrismaModule,
    MulterModule.register({ dest: './uploads' }) // нужно для @UploadedFile
  ],
  controllers: [RecognizeController],
  providers: [RecognizeService, PrismaService],
  exports: [RecognizeService],
})
export class RecognizeModule {
   constructor() {
    console.log('🧩 RecognizeModule инициализирован');
  }
}



