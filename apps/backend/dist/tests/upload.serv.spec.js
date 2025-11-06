"use strict";
// // tests/upload.service.integration.spec.ts
// import { UploadService } from '../src/upload/upload.service';
// import { RecognizeService } from '../src/recognize/recognize.service';
// import * as fs from 'fs';
// import * as fsPromises from 'fs/promises';
// import * as path from 'path';
// describe('UploadService (integration)', () => {
//   let service: UploadService;
//   beforeEach(() => {
//     const recognizeService = new RecognizeService();
//     service = new UploadService(recognizeService);
//   });
//   it('должен распознать файл и удалить его после обработки', async () => {
//     const tempFilePath = path.join(__dirname, 'temp-file.txt');
//     // Создаём временный файл
//     fs.writeFileSync(tempFilePath, 'test content');
//     // Проверяем, что файл существует
//     expect(fs.existsSync(tempFilePath)).toBe(true);
//     // Вызываем processFile
//     const result = await service.processFile(tempFilePath);
//     // Проверяем результат распознавания
//     expect(result.data).toEqual({
//       recipes: [{ title: 'Омлет с сыром', missing: [] }],
//     });
//  expect(result.message).toEqual(
//      "Файл успешно распознан"
//     );
//     // Файл должен быть удалён
//     expect(fs.existsSync(tempFilePath)).toBe(false);
//   });
// });
