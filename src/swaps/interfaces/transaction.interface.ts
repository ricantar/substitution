export interface TransactionResponse {
  hash: string;             // The transaction hash
  blockHash: string;        // The hash of the block containing the transaction
  blockNumber: number;      // The block number containing the transaction
  from: string;             // The address that sent the transaction
  to: string;               // The address the transaction was sent to
  gasUsed: string;          // The amount of gas used by the transaction
  status: string;           // The status of the transaction ('succeeded' or 'failed')
  confirmations: number;    // The number of confirmations the transaction has received
  timestamp: number;        // The timestamp when the transaction was included in a block
}

export interface ApprovalTransaction {
  status: 'failed';
  reason:
  | 'transaction_simulation_failed'
  | 'order_expired'
  | 'last_look_declined'
  | 'transaction_reverted'
  | 'market_maker_sigature_error'
  | 'invalid_balance'
  | 'internal_error';
  transactions: SwapTransaction[];
  zid: string;
}

export interface SwapTransaction {
  hash: string;
  timestamp: number;
  zid: string;
}
