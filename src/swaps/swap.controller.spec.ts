import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { SwapResponse } from '@interfaces/swap.interface';
import { TransactionResponse } from '@interfaces/transaction.interface';
import { BadRequestException } from '@nestjs/common';

describe('SwapController', () => {
  let swapController: SwapController;
  let swapService: SwapService;

  beforeEach(async () => {
    const mockSwapService = {
      getQuote: jest.fn(),
      getTransaction: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [SwapController],
      providers: [
        {
          provide: SwapService,
          useValue: mockSwapService,
        },
      ],
    }).compile();

    swapController = app.get<SwapController>(SwapController);
    swapService = app.get<SwapService>(SwapService);
  });

  describe('getQuote', () => {
    it('should return a SwapResponse', async () => {
      const mockResponse: SwapResponse = {
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

      jest.spyOn(swapService, 'getQuote').mockResolvedValue(mockResponse);

      const response = await swapController.getQuote(
        '1',
        'ETH',
        'DAI',
        '1000000000000000000',
        '0xTakerAddress',
      );
      expect(response).toEqual(mockResponse);
    });

    it('should throw a BadRequestException if service throws an error', async () => {
      jest.spyOn(swapService, 'getQuote').mockRejectedValue(new BadRequestException('Invalid parameters'));

      await expect(
        swapController.getQuote('1', 'ETH', 'DAI', '1000000000000000000', '0xTakerAddress')
      ).rejects.toBeInstanceOf(BadRequestException);
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

      jest.spyOn(swapService, 'getTransaction').mockResolvedValue(mockTransactionResponse);

      const response = await swapController.getTransaction('0xTransactionHash', '1');
      expect(response).toEqual(mockTransactionResponse);
    });

    it('should throw a BadRequestException if service throws an error', async () => {
      jest.spyOn(swapService, 'getTransaction').mockRejectedValue(new BadRequestException('Transaction not found'));

      await expect(swapController.getTransaction('0xInvalidTransactionHash', '1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw a BadRequestException if no txHash is provided', () => {
      expect(() => swapController.getTransaction('', '1')).toThrow(BadRequestException);
    });
  });
});
