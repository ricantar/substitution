export const getGroveCityRpcUrl = (chainId: string): string => {
    const appKey = process.env.GROVE_APP;
    if (!appKey) {
        throw new Error('GROVE_APP environment variable is not set');
    }

    switch (chainId) {
        case '1':
            return `https://eth-mainnet.rpc.grove.city/v1/${appKey}`; // Ethereum Mainnet
        case '137':
            return `https://poly-mainnet.rpc.grove.city/v1/${appKey}`; // Polygon Mainnet
        case '42161':
            return `https://arbitrum-one.rpc.grove.city/v1/${appKey}`; // Arbitrum
        case '8453':
            return `https://base-mainnet.rpc.grove.city/v1/${appKey}`; // Base
        case '10':
            return `https://optimism-mainnet.rpc.grove.city/v1/${appKey}`; // Optimism
        case '56':
            return `https://bsc-mainnet.rpc.grove.city/v1/${appKey}`; // Binance Smart Chain (BSC)
        case '43114':
            return `https://avax-archival.rpc.grove.city/v1/${appKey}`; // Avalanche
        default:
            throw new Error('Unsupported network');
    }
};
