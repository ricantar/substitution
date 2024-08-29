import { Controller, Get, Query, BadRequestException, Post, Param, Body } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapResponse } from '@interfaces/swap.interface';
import { TransactionResponse } from '@interfaces/transaction.interface';
import { SwapDto } from '@dto/swap.dto';
import { Swap } from './swap.entity';

@Controller()
export class SwapController {
  constructor(private readonly swapService: SwapService) { }

  @Get('quote')
  getQuote(
    @Query('chainId') chainId: string,
    @Query('buyToken') buyToken: string,
    @Query('sellToken') sellToken: string,
    @Query('sellAmount') sellAmount: string,
    @Query('taker') taker: string,
  ): Promise<SwapResponse> {
    return this.swapService.getQuote(chainId, buyToken, sellToken, sellAmount, taker);
  }

  @Get('status/:txHash')
  getTransaction(@Param('txHash') txHash: string, @Query('chainId') chainId: string,): Promise<TransactionResponse> {
    if (!txHash) {
      throw new BadRequestException('Transaction hash is required');
    }
    return this.swapService.getTransaction(txHash, chainId);
  }

  
  @Get('history')
  async getHistoricalData(): Promise<Swap[]> {
    return await this.swapService.getHistoricalData();
  }

  @Post('swap')
  async executeSwap(@Body() swapDto: SwapDto) {
    const swapDetails = await this.swapService.executeSwap(swapDto);

    await this.swapService.saveSwap({
      chainId: swapDto.chainId,
      buyToken: swapDto.buyToken,
      sellToken: swapDto.sellToken,
      sellAmount: swapDto.sellAmount,
      buyAmount: swapDetails.buyAmount,
      transactionHash: swapDetails.tradeHash,
    });

    return swapDetails
  }
}
