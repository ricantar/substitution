import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SwapResponse } from './interfaces/swap.interface';
import { TOKEN_ADDRESS_MAP } from './utils/chains-map';

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
      '0x-api-key': process.env.API_KEY
    };

    return this.httpService.get(url, { headers }).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new BadRequestException(error.response?.data || 'Error fetching quote');
      }),
    );
  }
}