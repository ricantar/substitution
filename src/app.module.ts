import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SwapController } from './swaps/swap.controller';
import { HttpModule } from '@nestjs/axios'
import { SwapService } from './swaps/swap.service';
import { ApiKeyMiddleware } from './middleware/auth.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './swaps/swap.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Swap], 
      synchronize: true,  // TODO: Set to false in production
    }),
    TypeOrmModule.forFeature([Swap]), 
    HttpModule],
  controllers: [SwapController],
  providers: [SwapService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware, RateLimitMiddleware)
      .forRoutes(SwapController);  // Apply middleware to specific routes
  }
}
