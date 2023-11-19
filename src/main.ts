import { NestFactory } from '@nestjs/core';
import { ApiExceptionFilter } from './api-exception.filter';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(3000);
}
bootstrap();
