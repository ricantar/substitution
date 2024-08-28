import { Module } from '@nestjs/common';
import { SwapController } from './swaps/swap.controller';
import { HttpModule } from '@nestjs/axios'
import { SwapService } from './swaps/swap.service';

@Module({
  imports: [HttpModule],
  controllers: [SwapController],
  providers: [SwapService],
})
export class AppModule {}
