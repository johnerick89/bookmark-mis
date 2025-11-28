"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1', {
        exclude: [
            { path: 'health', method: undefined },
            { path: 'docs', method: undefined },
        ],
    });
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Bookmark Management API')
        .setDescription('API for managing bookmarks, users, and tags')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.getHttpAdapter().get('/health', (req, res) => {
        console.log('Health check endpoint hit');
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development',
        });
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`📖 API docs: http://localhost:${port}/api`);
    console.log(`\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map