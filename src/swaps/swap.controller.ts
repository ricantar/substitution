import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SwapService } from './swap.service';
import { Observable } from 'rxjs';
import { SwapResponse } from './interfaces/swap.interface';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('quote')
  getQuote(
    @Query('chainId') chainId: string,
    @Query('buyToken') buyToken: string,
    @Query('sellToken') sellToken: string,
    @Query('sellAmount') sellAmount: string,
    @Query('taker') taker: string,
  ): Observable<SwapResponse> {
    return this.swapService.getQuote(chainId, buyToken, sellToken, sellAmount, taker);
  }
}
