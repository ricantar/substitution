import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { of } from 'rxjs';
import { SwapResponse } from './interfaces/swap.interface';

describe('SwapController', () => {
  let swapController: SwapController;
  let swapService: SwapService;

  beforeEach(async () => {
    const mockSwapService = {
      getQuote: jest.fn(),
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
        fees: {
          integratorFee: null,
          zeroExFee: null,
          gasFee: null,
        },
        issues: {
          allowance: null,
          balance: null,
          simulationIncomplete: false,
          invalidSourcesPassed: [],
        },
        liquidityAvailable: true,
        minBuyAmount: '999000000000000000',
        route: {
          fills: [],
          tokens: [],
        },
        sellAmount: '1000000000000000000',
        sellToken: '0xTokenSellAddress',
        target: '0xTargetContractAddress',
        tokenMetadata: {
          buyToken: {
            buyTaxBps: null,
            sellTaxBps: null,
          },
          sellToken: {
            buyTaxBps: null,
            sellTaxBps: null,
          },
        },
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
});
