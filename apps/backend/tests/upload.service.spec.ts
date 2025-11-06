import { describe, beforeEach, it, expect } from '@jest/globals';
import { UploadService } from '../src/upload/upload.service';
// import { PrismaService } from '@prisma/prisma.service';
// import { RecognizeService } from '@recognize/recognize.service';
import fs from 'fs';


// Мокаем весь fs/promises
// jest.mock('fs/promises', () => ({
//   unlink: jest.fn().mockResolvedValue(undefined),
// }));

// describe('UploadService', () => {
//   let service: UploadService;
//   let recognizeServiceMock: any;
//   let fsPromises: typeof import('fs/promises');

//   beforeEach(async () => {
//     recognizeServiceMock = {
//       recognize: jest.fn().mockResolvedValue({
//         recipes: [{ title: 'Омлет с сыром', missing: [] }],
//       }),
//     };

//     service = new UploadService(recognizeServiceMock);

//     fsPromises = await import('fs/promises');
//   });

//   it('должен возвращать результат распознавания и удалить файл', async () => {
//     const fakeFilePath = 'test-file.txt';
//     const fs = await import('fs');
//     fs.writeFileSync(fakeFilePath, 'test');

//     const result = await service.processFile(fakeFilePath);

//     expect(result.data.recipes).toEqual([
//       { title: 'Омлет с сыром', missing: [] },
//     ]);

//     expect(fsPromises.unlink).toHaveBeenCalledWith(fakeFilePath);
//   });
// });
