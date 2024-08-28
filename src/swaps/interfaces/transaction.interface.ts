export interface TransactionResponse {
    approvalTransactions: ApprovalTransaction[];
    transactions: SwapTransaction[];
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
  