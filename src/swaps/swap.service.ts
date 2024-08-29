import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { SwapExecutionResponse, SwapResponse } from '@interfaces/swap.interface';
import { TOKEN_ADDRESS_MAP } from '@utils/chains-map';
import { TransactionResponse } from '@interfaces/transaction.interface';
import { SwapDto } from '@dto/swap.dto';
import { ethers } from 'ethers';
import { getGroveCityRpcUrl } from '@utils/utils';

@Injectable()
export class SwapService {
  constructor(private readonly httpService: HttpService) { }

  async getQuote(chainId: string, buyTokenTicker: string, sellTokenTicker: string, sellAmount: string, taker: string): Promise<SwapResponse> {

    const buyToken = TOKEN_ADDRESS_MAP[buyTokenTicker.toUpperCase()]?.[chainId];
    const sellToken = TOKEN_ADDRESS_MAP[sellTokenTicker.toUpperCase()]?.[chainId];

    if (!chainId || !buyToken || !sellToken || !sellAmount || !taker) {
      throw new BadRequestException('Missing required parameters');
    }

    const url = `https://api.0x.org/swap/v1/quote?chainId=${chainId}&buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&taker=${taker}`;

    const headers = {
      '0x-api-key': process.env.ZEROX_API_KEY
    };

    try {
      const response = await lastValueFrom(this.httpService.get(url, { headers }));
      return this.mapToSwapResponse(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching quote from 0x API';
      throw new BadRequestException(errorMessage);
    }
  }

  async getTransaction(txHash: string, chainId: string): Promise<TransactionResponse> {
    try {
      const groveEndpoint = getGroveCityRpcUrl(chainId);
      const provider = ethers.getDefaultProvider(groveEndpoint);

      const transaction = await provider.getTransaction(txHash);

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      const confirmations = await provider.getTransactionCount(transaction.from);

      return {
        hash: transaction.hash,
        blockHash: transaction.blockHash || '',
        blockNumber: transaction.blockNumber || 0,
        from: transaction.from,
        to: transaction.to,
        gasUsed: transaction.gasLimit.toString(),
        status: confirmations > 0 ? 'succeeded' : 'pending',
        confirmations: confirmations,
        timestamp: (await provider.getBlock(transaction.blockNumber)).timestamp,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error fetching transaction details');
    }
  }


  async executeSwap(swapDto: SwapDto): Promise<SwapExecutionResponse> {
    const { chainId, buyToken, sellAmount, sellToken, walletAddress, privateKey } = swapDto;

    try {
      const quote: SwapResponse = await this.getQuote(chainId, buyToken, sellToken, sellAmount, walletAddress);

      const groveEndpoint = getGroveCityRpcUrl(chainId);
      const provider = ethers.getDefaultProvider(groveEndpoint);
      const wallet = new ethers.Wallet(privateKey, provider);

      const gasLimit = ethers.toBigInt(quote.estimatedGas);
      const gasPrice = ethers.toBigInt(quote.gasPrice);

      const transaction = {
        to: quote.to,
        data: quote.data,
        value: ethers.toBigInt(quote.value),
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        nonce: await provider.getTransactionCount(wallet.address),
        chainId: parseInt(chainId, 10),
      };

      const txResponse = await wallet.sendTransaction(transaction);

      return {
        tradeHash: txResponse.hash,
        type: 'settler_metatransaction',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error executing swap');
    }
  }


  private mapToSwapResponse(data: any): SwapResponse {
    return {
      chainId: data.chainId,
      price: data.price,
      guaranteedPrice: data.guaranteedPrice,
      estimatedPriceImpact: data.estimatedPriceImpact,
      to: data.to,
      data: data.data,
      value: data.value,
      gas: data.gas,
      estimatedGas: data.estimatedGas,
      gasPrice: data.gasPrice,
      protocolFee: data.protocolFee,
      minimumProtocolFee: data.minimumProtocolFee,
      buyTokenAddress: data.buyTokenAddress,
      sellTokenAddress: data.sellTokenAddress,
      buyAmount: data.buyAmount,
      sellAmount: data.sellAmount,
      sources: data.sources.map((source: any) => ({
        name: source.name,
        proportion: source.proportion,
      })),
      orders: data.orders.map((order: any) => ({
        makerToken: order.makerToken,
        takerToken: order.takerToken,
        makerAmount: order.makerAmount,
        takerAmount: order.takerAmount,
        fillData: {
          tokenAddressPath: order.fillData.tokenAddressPath,
          router: order.fillData.router,
        },
        source: order.source,
        sourcePathId: order.sourcePathId,
        type: order.type,
      })),
      allowanceTarget: data.allowanceTarget,
      sellTokenToEthRate: data.sellTokenToEthRate,
      buyTokenToEthRate: data.buyTokenToEthRate,
      fees: {
        zeroExFee: data.fees.zeroExFee,
      },
      grossPrice: data.grossPrice,
      grossBuyAmount: data.grossBuyAmount,
      grossSellAmount: data.grossSellAmount,
    };
  }
}