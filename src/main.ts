import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import basicAuth from 'express-basic-auth'
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('bootstrap')
    const app = await NestFactory.create(AppModule);

    app.use('/docs*', basicAuth({
        challenge: true,
        users: { user: process.env.DEV_API_PASSWORD! },
    }))

    const config = new DocumentBuilder()
        .addBearerAuth(
            {
                name: 'Authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'User Access Token'
        )
        .setTitle('Task Management APIs')
        .setDescription(`<center>test</center>`)
        .addServer('http://localhost:3000', 'dev')
        .addServer('https://x.com', 'production')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const swaggerSetupOptions = {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Happy Learning',
        customfavIcon: 'https://i.postimg.cc/xCxRcXfH/484546.jpg'
    }
    SwaggerModule.setup('docs', app, document, swaggerSetupOptions);

    if (process.env.NODE_ENV === 'development') {
        app.enableCors()
    } else {
        app.enableCors({ origin: [process.env.ALLOWED_ORIGIN_WEBSITE_1!] })
    }

    const port = process.env.PORT || 3000
    await app.listen(port);
    logger.log(`Server is listening on port ${port}`)
}
bootstrap();
