// tests/upload.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../src/upload/upload.controller';
import { UploadService } from '../src/upload/upload.service';
import * as fs from 'fs';


jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  unlink: jest.fn((path, cb) => cb?.(null)),
}));
describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            processFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('должен возвращать результат и удалять файл', async () => {
    const fakeFilePath = 'uploads/test-file.txt';
    const fakeFile = { path: fakeFilePath } as Express.Multer.File;
    const fakeResult = { message: 'Файл успешно распознан', data: { recipes: [{ title: 'Омлет с сыром', missing: [] }] } };

    // мок на сервис
    (service.processFile as jest.Mock).mockResolvedValue(fakeResult);

    // мок на fs.unlink
    const unlinkSpy = jest.spyOn(fs, 'unlink').mockImplementation((path, cb) => cb?.(null));

    const result = await controller.uploadFile(fakeFile);

    expect(service.processFile).toHaveBeenCalledWith(fakeFilePath);
    expect(unlinkSpy).toHaveBeenCalledWith(fakeFilePath, expect.any(Function));
    expect(result).toEqual({ success: true, result: fakeResult });

    unlinkSpy.mockRestore();
  });

  it('должен кидать BadRequestException, если файл не загружен', async () => {
    await expect(controller.uploadFile(null as any)).rejects.toThrow('Файл не загружен');
  });

  it('должен удалять файл даже при ошибке сервиса', async () => {
    const fakeFilePath = 'uploads/test-file.txt';
    const fakeFile = { path: fakeFilePath } as Express.Multer.File;

    (service.processFile as jest.Mock).mockRejectedValue(new Error('Ошибка сервиса'));

    const unlinkSpy = jest.spyOn(fs, 'unlink').mockImplementation((path, cb) => cb?.(null));

    await expect(controller.uploadFile(fakeFile)).rejects.toThrow('Ошибка при обработке файла');

    expect(unlinkSpy).toHaveBeenCalledWith(fakeFilePath, expect.any(Function));

    unlinkSpy.mockRestore();
  });
});
