import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SwapService } from './swap.service';
import { of, throwError } from 'rxjs';
import { SwapResponse } from './interfaces/swap.interface';
import { TransactionResponse } from './interfaces/transaction.interface';
import { AxiosResponse } from 'axios';
import { BadRequestException } from '@nestjs/common';

describe('SwapService', () => {
    let service: SwapService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SwapService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SwapService>(SwapService);
        httpService = module.get<HttpService>(HttpService);
    });

    describe('getQuote', () => {
        it('should return a SwapResponse', (done) => {
            const mockSwapResponse: SwapResponse = {
                approval: null,
                blockNumber: '12345',
                buyAmount: '1000000000000000000',
                buyToken: '0xTokenBuyAddress',
                liquidityAvailable: true,
                minBuyAmount: '999000000000000000',
                route: {
                    fills: [],
                    tokens: [],
                },
                sellAmount: '1000000000000000000',
                sellToken: '0xTokenSellAddress',
                target: '0xTargetContractAddress',
                totalNetworkFee: '1555000',
                trade: {
                    type: 'settler_metatransaction',
                    hash: '0xTradeHash',
                    eip712: {
                        types: {},
                        domain: {
                            name: '0x',
                            version: '1',
                            chainId: 1,
                            verifyingContract: '0xVerifyingContract',
                            salt: '0xSalt',
                        },
                        primaryType: 'Trade',
                        message: {},
                    },
                },
                zid: '0xZid',
            };

            const axiosResponse: AxiosResponse<SwapResponse> = {
                data: mockSwapResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

            service.getQuote('1', 'ETH', 'DAI', '1000000000000000000', '0xTakerAddress').subscribe((response) => {
                expect(response).toEqual(mockSwapResponse);
                done();
            });
        });

        it('should throw a BadRequestException if API call fails', (done) => {
            const axiosErrorResponse: AxiosResponse<any> = {
                data: 'Some error',
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => axiosErrorResponse))

            service.getQuote('1', 'ETH', 'DAI', '10', '0xTakerAddress').subscribe({
                next: () => { },
                error: (error) => {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Error fetching quote');
                    done();
                },
            });
        });
    });

    describe('getTransaction', () => {
        it('should return a TransactionResponse', (done) => {
            const mockTransactionResponse: TransactionResponse = {
                approvalTransactions: [
                    {
                        status: 'failed',
                        reason: 'transaction_reverted',
                        transactions: [
                            {
                                hash: '0xTransactionHash1',
                                timestamp: 1628169203,
                                zid: '0xZid1',
                            },
                        ],
                        zid: '0xZid1',
                    },
                ],
                transactions: [
                    {
                        hash: '0xTransactionHash2',
                        timestamp: 1628169204,
                        zid: '0xZid2',
                    },
                ],
            };

            const axiosResponse: AxiosResponse<TransactionResponse> = {
                data: mockTransactionResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

            service.getTransaction('0xTransactionHash').subscribe((response) => {
                expect(response).toEqual(mockTransactionResponse);
                done();
            });
        });

        it('should throw a BadRequestException if API call fails', (done) => {
            const axiosErrorResponse: AxiosResponse<any> = {
                data: 'Some error',
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => axiosErrorResponse))

            service.getTransaction('0xInvalidTransactionHash').subscribe({
                next: () => { },
                error: (error) => {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Error fetching transaction details');
                    done();
                },
            });
        });
    });
});
