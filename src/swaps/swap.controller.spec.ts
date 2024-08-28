import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { of } from 'rxjs';
import { SwapResponse } from './interfaces/swap.interface';
import { TransactionResponse } from './interfaces/transaction.interface';
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
    it('should return a SwapResponse', (done) => {
      const mockResponse: SwapResponse = {
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

      jest.spyOn(swapService, 'getQuote').mockReturnValue(of(mockResponse));

      swapController
        .getQuote('1', '0xTokenBuyAddress', '0xTokenSellAddress', '1000000000000000000', '0xTakerAddress')
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          done();
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

      jest.spyOn(swapService, 'getTransaction').mockReturnValue(of(mockTransactionResponse));

      swapController.getTransaction('0xTransactionHash').subscribe((response) => {
        expect(response).toEqual(mockTransactionResponse);
        done();
      });
    });

    it('should throw a BadRequestException if no txHash is provided', () => {
      expect(() => swapController.getTransaction('')).toThrow(BadRequestException);
    });
  });
});
