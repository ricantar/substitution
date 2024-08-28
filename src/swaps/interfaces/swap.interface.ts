export interface SwapResponse {
  approval: Approval | null;
  blockNumber: string;
  buyAmount: string;
  buyToken: string;
  liquidityAvailable: boolean;
  minBuyAmount: string;
  route: Route;
  sellAmount: string;
  sellToken: string;
  target: string;
  trade: Trade;
  totalNetworkFee: string;
  zid: string;
}

export interface Approval {
  type: "executeMetaTransaction::approve" | "permit" | "daiPermit";
  hash: string;
  eip712: EIP712;
}

export interface EIP712 {
  types: Record<string, EIP712Type[]>;
  domain: EIP712Domain;
  primaryType: string;
  message: Record<string, any>;
}

export interface EIP712Type {
  name: string;
  type: string;
}

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
  salt?: string;
}

export interface Fees {
  integratorFee: FeeDetails | null;
  zeroExFee: FeeDetails | null;
  gasFee: FeeDetails | null;
}

export interface FeeDetails {
  amount: string;
  token: string;
  type: "volume" | "gas";
}

export interface Issues {
  allowance: Allowance | null;
  balance: Balance | null;
  simulationIncomplete: boolean;
  invalidSourcesPassed: string[];
}

export interface Allowance {
  actual: string;
  spender: string;
}

export interface Balance {
  token: string;
  actual: string;
  expected: string;
}

export interface Route {
  fills: Fill[];
  tokens: Token[];
}

export interface Fill {
  from: string;
  to: string;
  source: string;
  proportionBps: string;
}

export interface Token {
  address: string;
  symbol: string;
}

export interface TokenMetadata {
  buyToken: TokenTaxMetadata;
  sellToken: TokenTaxMetadata;
}

export interface TokenTaxMetadata {
  buyTaxBps: string | null;
  sellTaxBps: string | null;
}

export interface Trade {
  type: "settler_metatransaction";
  hash: string;
  eip712: EIP712;
}
