export interface SwapResponse {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: SwapSource[];
  orders: SwapOrder[];
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  fees: SwapFees;
  grossPrice: string;
  grossBuyAmount: string;
  grossSellAmount: string;
}

export interface SwapSource {
  name: string;
  proportion: string;
}

export interface SwapOrder {
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  fillData: FillData;
  source: string;
  sourcePathId: string;
  type: number;
}

export interface FillData {
  tokenAddressPath: string[];
  router: string;
}

export interface SwapFees {
  zeroExFee: null | any; 
}


export interface SwapExecutionResponse {
  tradeHash: string;
  type: string;
  buyAmount: string;
}
