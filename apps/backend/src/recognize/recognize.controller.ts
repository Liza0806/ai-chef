import { Controller, Get, Query, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecognizeService } from './recognize.service';
import { ModuleRef } from '@nestjs/core';
import { error } from 'console';
import * as multer from 'multer';


@Controller('recognize')
export class RecognizeController {
  
//  constructor(private readonly recognizeService: RecognizeService) {}
 constructor(
    private readonly recognizeService: RecognizeService,
    private readonly moduleRef: ModuleRef, // <- вот так
  ) {
    console.log('RecognizeController создан, сервис:', recognizeService);
    console.log('ModuleRef:', moduleRef);
  }


  // GET для рецептов
  @Get()
  async getRecipes(@Query('ingredients') ingredientsQuery?: string) {
    const ingredients = ingredientsQuery
      ? ingredientsQuery.split(',').map(i => i.trim()).filter(Boolean)
      : [];
    //@ts-ignore
    return this.recognizeService.getRecipes(ingredients);
  }

  // POST для распознавания изображений
  @Post()
  
 // @UseInterceptors(FileInterceptor('image')) // 'image' — имя поля формы
 @UseInterceptors(FileInterceptor('image', {
  storage: multer.memoryStorage(),
}))
  async recognize(@UploadedFile() file: Express.Multer.File) {
    
    console.log('✅ Метод recognize() вызван. файл -', file);
  

    if (!file) {
      console.log(error)
      return { error: 'No file uploaded' };
    }

    try { /// тут уже не идет, так как файл андефайнд
      console.log('Файл получен:', file.originalname, file.mimetype, file.size);
      const predictions = await this.recognizeService.recognize(file.buffer); //////////тут проблема!!!
      console.log('Предсказания:', predictions);
      return predictions;
    } catch (err) {
      console.error('Ошибка распознавания:', err);
      //@ts-ignore
      return { error: 'Internal server error', details: err.message };
    }
  }
}

/// curl -X POST http://localhost:3000/api/recognize -F "image=@\"C:\Users\user\Desktop\aaa.jpg\""

/// -F "image=@C:\Users\user\Desktop\aaa.jpg"