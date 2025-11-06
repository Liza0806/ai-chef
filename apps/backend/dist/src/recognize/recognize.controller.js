"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognizeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const recognize_service_1 = require("./recognize.service");
const core_1 = require("@nestjs/core");
let RecognizeController = class RecognizeController {
    //  constructor(private readonly recognizeService: RecognizeService) {}
    constructor(recognizeService, moduleRef) {
        this.recognizeService = recognizeService;
        this.moduleRef = moduleRef;
        console.log('RecognizeController создан, сервис:', recognizeService);
        console.log('ModuleRef:', moduleRef);
    }
    // GET для рецептов
    async getRecipes(ingredientsQuery) {
        const ingredients = ingredientsQuery
            ? ingredientsQuery.split(',').map(i => i.trim()).filter(Boolean)
            : [];
        //@ts-ignore
        return this.recognizeService.getRecipes(ingredients);
    }
    // POST для распознавания изображений
    async recognize(file) {
        console.log('✅ Метод recognize() вызван');
        if (!file) {
            return { error: 'No file uploaded' };
        }
        try {
            console.log('Файл получен:', file.originalname, file.mimetype, file.size);
            const predictions = await this.recognizeService.recognize(file.buffer); //////////тут проблема!!!
            console.log('Предсказания:', predictions);
            return predictions;
        }
        catch (err) {
            console.error('Ошибка распознавания:', err);
            //@ts-ignore
            return { error: 'Internal server error', details: err.message };
        }
    }
};
exports.RecognizeController = RecognizeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('ingredients')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecognizeController.prototype, "getRecipes", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')) // 'image' — имя поля формы
    ,
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecognizeController.prototype, "recognize", null);
exports.RecognizeController = RecognizeController = __decorate([
    (0, common_1.Controller)('recognize'),
    __metadata("design:paramtypes", [recognize_service_1.RecognizeService,
        core_1.ModuleRef])
], RecognizeController);
/// curl -X POST http://localhost:3000/api/recognize -F "image=@\"C:\Users\user\Desktop\aaa.jpg\""
/// -F "image=@C:\Users\user\Desktop\aaa.jpg"
