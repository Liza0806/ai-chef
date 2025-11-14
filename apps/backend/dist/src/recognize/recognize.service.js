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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RecognizeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognizeService = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const canvas_1 = require("@napi-rs/canvas");
const common_1 = require("@nestjs/common");
const cocoSsd = __importStar(require("@tensorflow-models/coco-ssd"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const fetch = (...args) => Promise.resolve().then(() => __importStar(require("node-fetch"))).then(({ default: fetch }) => fetch(...args));
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}
let RecognizeService = RecognizeService_1 = class RecognizeService {
    constructor() {
        this.model = null;
        this.logger = new common_1.Logger(RecognizeService_1.name);
        this.modelPath = path_1.default.resolve('./src/models/coco-ssd/model.json');
    }
    async loadModel() {
        if (!this.model) {
            if (!fs.existsSync(this.modelPath)) {
                throw new Error(`Модель не найдена по пути ${this.modelPath}`);
            }
            this.logger.log('Загрузка модели...');
            this.model = await cocoSsd.load({
                base: 'lite_mobilenet_v2',
                modelUrl: `file://${this.modelPath}`,
            });
            this.logger.log('Модель загружена ✅');
        }
        return this.model;
    }
    async recognize(imageBuffer) {
        const model = await this.loadModel();
        const img = await (0, canvas_1.loadImage)(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`);
        const canvas = (0, canvas_1.createCanvas)(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const imageTensor = tf.tensor3d(new Uint8Array(imageData.data), [img.height, img.width, 4], 'int32');
        const rgbTensor = imageTensor.slice([0, 0, 0], [-1, -1, 3]);
        const predictions = await model.detect(rgbTensor);
        imageTensor.dispose();
        rgbTensor.dispose();
        return predictions;
    }
};
exports.RecognizeService = RecognizeService;
exports.RecognizeService = RecognizeService = RecognizeService_1 = __decorate([
    (0, common_1.Injectable)()
], RecognizeService);
