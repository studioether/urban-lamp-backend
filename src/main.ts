import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
   }))
  // app.useGlobalGuards(new RefreshJwtAuthGuard(new Reflector()), new JwtAuthGuard(new Reflector()))
  app.useGlobalGuards(new RefreshJwtAuthGuard(new Reflector()))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  //* swagger setup
  const configService = app.get(ConfigService)
  const config = new DocumentBuilder()
    .setTitle('urban-lamp')
    .setDescription('The Urban Lamp API')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header"
      },
      "JWT-auth"
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
   
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
    
  const port = process.env.PORT || configService.get<number>('port')
  
  await app.listen(port, () => {
      console.log(`listening on port ${port}`)
  });
}
bootstrap()
