import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SwapService } from './swap.service';
import { of, throwError } from 'rxjs';
import { SwapResponse } from '@interfaces/swap.interface';
import { TransactionResponse } from '@interfaces/transaction.interface';
import { AxiosResponse } from 'axios';
import { BadRequestException } from '@nestjs/common';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { Swap } from './swap.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SwapService', () => {
    let service: SwapService;
    let httpService: HttpService;
    let swapRepository: Repository<Swap>;

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
                {
                    provide: getRepositoryToken(Swap),
                    useClass: Repository, 
                  },
            ],
        }).compile();

        service = module.get<SwapService>(SwapService);
        httpService = module.get<HttpService>(HttpService);
        swapRepository = module.get<Repository<Swap>>(getRepositoryToken(Swap));
    });

    describe('getQuote', () => {
        it('should return a SwapResponse', async () => {
            const mockSwapResponse: SwapResponse = {
                chainId: 1,
                price: '1000',
                guaranteedPrice: '999',
                estimatedPriceImpact: '0.01',
                to: '0xTargetContractAddress',
                data: '0xSomeData',
                value: '0',
                gas: '21000',
                estimatedGas: '21000',
                gasPrice: '5000000000',
                protocolFee: '0',
                minimumProtocolFee: '0',
                buyTokenAddress: '0xTokenBuyAddress',
                sellTokenAddress: '0xTokenSellAddress',
                buyAmount: '1000000000000000000',
                sellAmount: '1000000000000000000',
                sources: [
                    {
                        name: 'Uniswap',
                        proportion: '1',
                    },
                ],
                orders: [
                    {
                        makerToken: '0xTokenBuyAddress',
                        takerToken: '0xTokenSellAddress',
                        makerAmount: '1000000000000000000',
                        takerAmount: '1000000000000000000',
                        fillData: {
                            tokenAddressPath: ['0xTokenSellAddress', '0xTokenBuyAddress'],
                            router: '0xRouterAddress',
                        },
                        source: 'Uniswap',
                        sourcePathId: '0xPathId',
                        type: 0,
                    },
                ],
                allowanceTarget: '0xAllowanceTarget',
                sellTokenToEthRate: '1',
                buyTokenToEthRate: '1000',
                fees: {
                    zeroExFee: null,
                },
                grossPrice: '1000',
                grossBuyAmount: '1000000000000000000',
                grossSellAmount: '1000000000000000000',
            };

            const axiosResponse: AxiosResponse<SwapResponse> = {
                data: mockSwapResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

            const response = await service.getQuote('1', 'ETH', 'DAI', '1000000000000000000', '0xTakerAddress');
            expect(response).toEqual(mockSwapResponse);
        });

        it('should throw a BadRequestException if API call fails', async () => {
            const axiosErrorResponse: AxiosResponse<any> = {
                data: { message: 'Some error' },
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => axiosErrorResponse));

            await expect(service.getQuote('1', 'ETH', 'DAI', '10', '0xTakerAddress'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it('should throw a BadRequestException for invalid tokens', async () => {
            jest.spyOn(httpService, 'get').mockImplementation(() => {
                throw new BadRequestException('Invalid token address');
            });

            await expect(service.getQuote('1', 'INVALID_TOKEN', 'DAI', '1000000000000000000', '0xTakerAddress'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it('should throw a BadRequestException for insufficient funds', async () => {
            const axiosErrorResponse: AxiosResponse<any> = {
                data: { message: 'Insufficient funds' },
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: null
            };

            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => axiosErrorResponse));

            await expect(service.getQuote('1', 'ETH', 'DAI', '10000000000000000000000000', '0xTakerAddress'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it('should handle network errors gracefully', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('Network error')));

            await expect(service.getQuote('1', 'ETH', 'DAI', '1000000000000000000', '0xTakerAddress'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });
    });

    describe('getTransaction', () => {
        it('should return a TransactionResponse', async () => {
            const mockTransactionResponse: TransactionResponse = {
                hash: '0xTransactionHash',
                blockHash: '0xBlockHash',
                blockNumber: 12345678,
                from: '0xFromAddress',
                to: '0xToAddress',
                gasUsed: '21000',
                status: 'succeeded',
                confirmations: 10,
                timestamp: 1628169203,
            };

            const providerMock = {
                getTransaction: jest.fn().mockResolvedValue({
                    hash: '0xTransactionHash',
                    blockHash: '0xBlockHash',
                    blockNumber: 12345678,
                    from: '0xFromAddress',
                    to: '0xToAddress',
                    gasLimit: ethers.toBigInt(21000),
                    confirmations: 10,
                }),
                getBlock: jest.fn().mockResolvedValue({
                    timestamp: 1628169203,
                }),
                getTransactionCount: jest.fn().mockResolvedValue(10),
            };

            jest.spyOn(ethers, 'getDefaultProvider').mockReturnValue(providerMock as any);

            const response = await service.getTransaction('0xTransactionHash', '1');
            expect(response).toEqual(mockTransactionResponse);
        });

        it('should throw a BadRequestException if transaction not found', async () => {
            const providerMock = {
                getTransaction: jest.fn().mockResolvedValue(null),
            };

            jest.spyOn(ethers, 'getDefaultProvider').mockReturnValue(providerMock as any);

            await expect(service.getTransaction('0xInvalidTransactionHash', '1'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it('should throw a BadRequestException if provider call fails', async () => {
            const providerMock = {
                getTransaction: jest.fn().mockRejectedValue(new Error('Network error')),
            };

            jest.spyOn(ethers, 'getDefaultProvider').mockReturnValue(providerMock as any);

            await expect(service.getTransaction('0xInvalidTransactionHash', '1'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it('should throw a BadRequestException for network errors', async () => {
            jest.spyOn(ethers, 'getDefaultProvider').mockImplementation(() => {
                throw new Error('Network error');
            });

            await expect(service.getTransaction('0xTransactionHash', '1'))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });
    });

    describe('History', () => {
        it('should return historical data', async () => {
            const mockSwapData: Swap[] = [
              {
                id: 1,
                chainId: '1',
                buyToken: 'ETH',
                sellToken: 'DAI',
                buyAmount: '1000',
                sellAmount: '2000',
                transactionHash: '0x123',
                createdAt: new Date(),
              },
            ];
          
            jest.spyOn(swapRepository, 'find').mockResolvedValue(mockSwapData);
          
            const result = await service.getHistoricalData();
            expect(result).toEqual(mockSwapData);
          });
          
    });
});
