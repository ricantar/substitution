import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ApiKeyMiddleware } from './middleware/auth.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

dotenv.config();

async function serverInit() {
  const app = await NestFactory.create(AppModule);

  app.use(new ApiKeyMiddleware().use);
  app.use(new RateLimitMiddleware().use);

  await app.listen(3000);
}
serverInit();
