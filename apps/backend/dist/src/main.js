"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api'); // добавляем общий префикс для всех роутов
    await app.listen(3000);
    console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
