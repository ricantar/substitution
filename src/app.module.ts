import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SwapController } from './swaps/swap.controller';
import { HttpModule } from '@nestjs/axios'
import { SwapService } from './swaps/swap.service';
import { ApiKeyMiddleware } from './middleware/auth.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

@Module({
  imports: [HttpModule],
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
