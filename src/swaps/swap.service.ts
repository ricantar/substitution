import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SwapResponse } from './interfaces/swap.interface';

@Injectable()
export class SwapService {
  constructor(private readonly httpService: HttpService) {}

  getQuote(chainId: string, buyToken: string, sellToken: string, sellAmount: string, taker: string): Observable<SwapResponse> {
    if (!chainId || !buyToken || !sellToken || !sellAmount || !taker) {
      throw new BadRequestException('Missing required parameters');
    }

    const url = `https://api.0x.org/swap/v2/quote?chainId=${chainId}&buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&taker=${taker}`;

    return this.httpService.get(url).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new BadRequestException(error.response?.data || 'Error fetching quote');
      }),
    );
  }
}
