import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SwapResponse } from './interfaces/swap.interface';
import { TOKEN_ADDRESS_MAP } from '../utils/chains-map';
import { TransactionResponse } from './interfaces/transaction.interface';

@Injectable()
export class SwapService {
  constructor(private readonly httpService: HttpService) { }

  getQuote(chainId: string, buyTokenTicker: string, sellTokenTicker: string, sellAmount: string, taker: string): Observable<SwapResponse> {

    const buyToken = TOKEN_ADDRESS_MAP[buyTokenTicker.toUpperCase()]?.[chainId];
    const sellToken = TOKEN_ADDRESS_MAP[sellTokenTicker.toUpperCase()]?.[chainId];

    if (!chainId || !buyToken || !sellToken || !sellAmount || !taker) {
      throw new BadRequestException('Missing required parameters');
    }

    const url = `https://api.0x.org/swap/permit2/quote?chainId=${chainId}&buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&taker=${taker}`;

    const headers = {
      '0x-api-key': process.env.ZEROX_API_KEY
    };

    return this.httpService.get(url, { headers }).pipe(
      map((response) => this.mapToSwapResponse(response.data)),
      catchError((error) => {
        throw new BadRequestException(error.response?.data || 'Error fetching quote');
      }),
    );
  }

  getTransaction(txHash: string): Observable<TransactionResponse> {
    const url = `https://api.0x.org/gasless/status/${txHash}`;

    const headers = {
      '0x-api-key': process.env.ZEROX_API_KEY,
    };

    return this.httpService.get(url, { headers }).pipe(
      map((response) => this.mapToTransactionResponse(response.data)),
      catchError((error) => {
        throw new BadRequestException(error.response?.data || 'Error fetching transaction details');
      }),
    );
  }

  /* Parsing */

  private mapToSwapResponse(data: any): SwapResponse {
    return {
      approval: data.approval,
      blockNumber: data.blockNumber,
      buyAmount: data.buyAmount,
      buyToken: data.buyToken,
      liquidityAvailable: data.liquidityAvailable,
      minBuyAmount: data.minBuyAmount,
      route: data.route,
      sellAmount: data.sellAmount,
      sellToken: data.sellToken,
      totalNetworkFee: data.totalNetworkFee,
      target: data.target,
      trade: data.trade,
      zid: data.zid,
    } as SwapResponse;
  }

  private mapToTransactionResponse(data: any): TransactionResponse {
    return {
      approvalTransactions: data.approvalTransactions.map((approval: any) => ({
        status: approval.status,
        reason: approval.reason,
        transactions: approval.transactions.map((transaction: any) => ({
          hash: transaction.hash,
          timestamp: transaction.timestamp,
          zid: transaction.zid,
        })),
        zid: approval.zid,
      })),
      transactions: data.transactions.map((transaction: any) => ({
        hash: transaction.hash,
        timestamp: transaction.timestamp,
        zid: transaction.zid,
      })),
    } as TransactionResponse;
  }
}

