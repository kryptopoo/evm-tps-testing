# EVM TPS Testing
The simple tool to do TPS testing on evm compatible networks.

## Getting Started

- Install package `npm i`

- Change `.env.example` to `.env` and configure 

### Deploy contract

- Deploy sample contract `ClaimableNFT.sol` 
    ```
    npx hardhat run scripts/deploy.js --network mantle-testnet
    ```

## Running tool


- Tranfer from parent wallet (index = 0) to child wallet `from` - `to` index
```
node index.js wallet-transfer --amount 50 --from 1 --to 10
```

- Get wallet info by `from` - `to` index
```
node index.js wallet-info --from 0 --to 10
```

- Run test with number of transaction `txs` with child wallet `from` - `to` index 
```
node index.js test --txs 9 --from 1 --to 192 
```

- Calculate TPS 
```
node index.js tps
```

### Result

#### TPS on Mantle.xyz network

| cpu        | thread  | account/wallet | transactions  | tps  | remark  |
|--|--|--|--|--|--|
| c6a.2xlarge <br /> 8 vCPU - 16GB     | 64   | 64   | 3    | [49](result/mantle_tps_49.json)   |  |
| c6a.2xlarge <br /> 8 vCPU - 16GB     | 128  | 128  | 6    | [95](result/mantle_tps_95.json)    |  |
| c6a.8xlarge <br /> 32 vCPU - 64GB    | 192  | 192  | 9    | [152](result/mantle_tps_152.json)   | server error |
| c6a.8xlarge <br /> 32 vCPU - 64GB    | 192  | 192  | 3    | [215](result/mantle_tps_215.json)   | concurrent |
| c6a.8xlarge <br /> 32 vCPU - 64GB    | 384  | 384  | 3    | [237](result/mantle_tps_237.json)   | concurrent <br/> INSUFFICIENT_FUNDS |
| c6a.8xlarge <br /> 32 vCPU - 64GB    | 384  | 384  | 4    | [314](result/mantle_tps_314.json)   | concurrent <br/> |
