"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tests/upload.controller.spec.ts
const testing_1 = require("@nestjs/testing");
const upload_controller_1 = require("../src/upload/upload.controller");
const upload_service_1 = require("../src/upload/upload.service");
const fs = __importStar(require("fs"));
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    unlink: jest.fn((path, cb) => cb?.(null)),
}));
describe('UploadController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [upload_controller_1.UploadController],
            providers: [
                {
                    provide: upload_service_1.UploadService,
                    useValue: {
                        processFile: jest.fn(),
                    },
                },
            ],
        }).compile();
        controller = module.get(upload_controller_1.UploadController);
        service = module.get(upload_service_1.UploadService);
    });
    it('должен возвращать результат и удалять файл', async () => {
        const fakeFilePath = 'uploads/test-file.txt';
        const fakeFile = { path: fakeFilePath };
        const fakeResult = { message: 'Файл успешно распознан', data: { recipes: [{ title: 'Омлет с сыром', missing: [] }] } };
        // мок на сервис
        service.processFile.mockResolvedValue(fakeResult);
        // мок на fs.unlink
        const unlinkSpy = jest.spyOn(fs, 'unlink').mockImplementation((path, cb) => cb?.(null));
        const result = await controller.uploadFile(fakeFile);
        expect(service.processFile).toHaveBeenCalledWith(fakeFilePath);
        expect(unlinkSpy).toHaveBeenCalledWith(fakeFilePath, expect.any(Function));
        expect(result).toEqual({ success: true, result: fakeResult });
        unlinkSpy.mockRestore();
    });
    it('должен кидать BadRequestException, если файл не загружен', async () => {
        await expect(controller.uploadFile(null)).rejects.toThrow('Файл не загружен');
    });
    it('должен удалять файл даже при ошибке сервиса', async () => {
        const fakeFilePath = 'uploads/test-file.txt';
        const fakeFile = { path: fakeFilePath };
        service.processFile.mockRejectedValue(new Error('Ошибка сервиса'));
        const unlinkSpy = jest.spyOn(fs, 'unlink').mockImplementation((path, cb) => cb?.(null));
        await expect(controller.uploadFile(fakeFile)).rejects.toThrow('Ошибка при обработке файла');
        expect(unlinkSpy).toHaveBeenCalledWith(fakeFilePath, expect.any(Function));
        unlinkSpy.mockRestore();
    });
});
