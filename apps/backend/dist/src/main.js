"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const server = (0, express_1.default)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.setGlobalPrefix('api');
    const modelsPath = path_1.default.join(__dirname, '..', 'models');
    console.log('📁 Static models path:', modelsPath);
    server.use('/models', express_1.default.static(modelsPath));
    await app.init();
    if (!process.env.VERCEL) {
        server.listen(3000, () => console.log('🚀 Local: http://localhost:3000'));
    }
}
bootstrap();
exports.default = server;
