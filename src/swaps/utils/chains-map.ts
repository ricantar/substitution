export const TOKEN_ADDRESS_MAP: { [key: string]: { [chainId: number]: string } } = {
    ETH: {
      1: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',  // Ethereum Mainnet (ETH)
      137: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // Polygon (WETH)
      42161: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // Arbitrum (WETH)
      10: '0x4200000000000000000000000000000000000006',   // Optimism (WETH)
      43114: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', // Avalanche (WETH.e)
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',   // BSC (Binance-Peg Ethereum Token)
      8453: '0x4200000000000000000000000000000000000006',  // Base (WETH)
    },
    WETH: {
      1: '0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2',    // Ethereum Mainnet (WETH)
      137: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',   // Polygon (WETH)
      42161: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // Arbitrum (WETH)
      10: '0x4200000000000000000000000000000000000006',    // Optimism (WETH)
      43114: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', // Avalanche (WETH.e)
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',    // BSC (Binance-Peg Ethereum Token)
      8453: '0x4200000000000000000000000000000000000006',   // Base (WETH)
    },
    MATIC: {
      137: '0x0000000000000000000000000000000000001010', // Polygon (MATIC as native token)
    },
    USDC: {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',    // Ethereum Mainnet (USDC)
      137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',   // Polygon (USDC)
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // Arbitrum (USDC)
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',   // Optimism (USDC)
      43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // Avalanche (USDC.e)
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',    // BSC (Binance-Peg USD Coin)
      8453: '0xd9f41e77f47f4b5c0af47008e5e1e3b64e4870b0',  // Base (USDC)
    },
    DAI: {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f',    // Ethereum Mainnet (DAI)
      137: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',   // Polygon (DAI)
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // Arbitrum (DAI)
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',    // Optimism (DAI)
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // Avalanche (DAI.e)
      56: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',    // BSC (Binance-Peg DAI)
      8453: '0x130966628846bfd36ff31a822705796e8cb8c18d',  // Base (DAI)
    },
    WBTC: {
      1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',    // Ethereum Mainnet (WBTC)
      137: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',   // Polygon (WBTC)
      42161: '0x2f2a2543b76a4166549f7aab2e75bef0c4abfec1', // Arbitrum (WBTC)
      10: '0x68f180fcce6836688e9084f035309e29bf0a2095',    // Optimism (WBTC)
      43114: '0x50b7545627a5162f82a992c33b87adc75187b218', // Avalanche (WBTC.e)
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',    // BSC (Binance-Peg BTCB)
      8453: '0x02f08dfd4a7076f2bf967446aaf74089e77b749f',  // Base (WBTC)
    },
  };
  