<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# Project Name

A NestJS-based application wrapping the 0x API for performing on-chain swaps and fetching transaction details.

## Table of Contents

- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Compile and Run the Project](#compile-and-run-the-project)
- [Run Tests](#run-tests)
- [API Documentation](#api-documentation)
  - [GET /swap/quote](#get-swapquote)
  - [POST /swap](#post-swap)
  - [GET /transaction/:txHash](#get-transactiontxhash)
- [Assumptions and Decisions](#assumptions-and-decisions)
- [Resources](#resources)
- [License](#license)

## Project Setup

$ npm install

## environment-variables
``` bash
Create a .env file in the root of your project to store your environment variables. The following variables are required:

- GROVE_APP: Your Grove API key. Which will be used for transactions
- ZEROX_API_KEY: Your 0x API key. Which will be used for quotes
- API_KEY : Your Key for the API
- RATE_LIMIT_WINDOW_MS: The time window you want the rate limit your api in MS. (default 1 sec)
- RATE_LIMIT_MAX_REQUESTS: Number of request in that window (default 3)
- RATE_LIMIT_MESSAGE: Message for the user
```

## compile-and-run-the-project
```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## run-tests

```
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

```

## api-documentation

**GET /quote**

Description: Fetch a quote for a token swap.

Request Parameters:

chainId (string, required): The ID of the blockchain network (e.g., 1 for Ethereum, 137 for Polygon).
buyToken (string, required): The ticker symbol of the token to buy.
sellToken (string, required): The ticker symbol of the token to sell.
sellAmount (string, required): The amount of the sell token (in wei) to swap.
taker (string, required): The wallet address performing the swap.
**Example Response:**
```
json
{
  "chainId": 1,
  "price": "2504.4918553394464675",
  "guaranteedPrice": "2479.4469367860520028",
  "estimatedPriceImpact": "0.0001",
  "to": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  "data": "0xd9627aa40000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000015817a685f9a1645c00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006b175474e89094c44da98b954eedeac495271d0f869584cd000000000000000000000000100000000000000000000000000000000000001100000000000000000000000000000000000000000000001c2e352fd761f763ab",
  "value": "0",
  "gas": "111000",
  "estimatedGas": "111000",
  "gasPrice": "93000000000",
  "protocolFee": "0",
  "minimumProtocolFee": "0",
  "buyTokenAddress": "0x6b175474e89094c44da98b954eedeac495271d0f",
  "sellTokenAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "buyAmount": "25044918553394464675",
  "sellAmount": "10000000000000000",
  "sources": [
    {
      "name": "SushiSwap",
      "proportion": "1"
    }
  ],
  "orders": [
    {
      "makerToken": "0x6b175474e89094c44da98b954eedeac495271d0f",
      "takerToken": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "makerAmount": "25044918553394464675",
      "takerAmount": "10000000000000000",
      "fillData": {
        "tokenAddressPath": [
          "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          "0x6b175474e89094c44da98b954eedeac495271d0f"
        ],
        "router": "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f"
      },
      "source": "SushiSwap",
      "sourcePathId": "0xe58bde9f0ca002c1e99df8df403eabe6431a3b0476ee5dfb92fe0a35af2f5ead",
      "type": 0
    }
  ],
  "allowanceTarget": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  "sellTokenToEthRate": "1",
  "buyTokenToEthRate": "2504.46738154874763977",
  "fees": {
    "zeroExFee": null
  },
  "grossPrice": "2504.4918553394464675",
  "grossBuyAmount": "25044918553394464675",
  "grossSellAmount": "10000000000000000"
}
```

**POST /swap**

Description: Execute an on-chain swap transaction using the quote obtained from the 0x API.

Request Body:
```
chainId (string, required): The ID of the blockchain network.
buyToken (string, required): The ticker symbol of the token to buy.
sellToken (string, required): The ticker symbol of the token to sell.
sellAmount (string, required): The amount of the sell token (in wei) to swap.
walletAddress (string, required): The wallet address performing the swap.
privateKey (string, required): The private key of the wallet (for signing the transaction).
```
Response:

Returns a SwapExecutionResponse object containing the transaction hash and other relevant information.

**Example**
```
{
  "tradeHash": "0xabc123...",
  "type": "settler_metatransaction"
}
```

**GET /transaction/:txHash?chainId=int**

Description: Fetch the details of a transaction.

Request Parameters:

txHash (string, required): The transaction hash.
chainId (string, required): The ID of the blockchain network.
Response:

Returns a TransactionResponse object containing details of the transaction, including status, block information, and gas used.
**Example**
```
{
  "hash": "0xabc123...",
  "blockHash": "0xdef456...",
  "blockNumber": 12345678,
  "from": "0xsender...",
  "to": "0xreceiver...",
  "gasUsed": "21000",
  "status": "succeeded",
  "confirmations": 3,
  "timestamp": 1628169204
}

```


## assumptions-and-decisions

- Grove City RPC: The application uses Grove City as the RPC provider for various blockchain networks. The network-specific URLs are dynamically constructed using the GROVE_APP environment variable.
- 0x API for Quotes: The application fetches swap quotes from the 0x API. It assumes the 0x API key is stored in the ZEROX_API_KEY environment variable.
- Error Handling: The application handles common errors such as invalid tokens, insufficient funds, and network issues by throwing appropriate exceptions.
- Testing: The application includes comprehensive unit tests to cover edge cases, including invalid inputs and network errors.