require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    "mantle-testnet": {
      url: process.env.RPC_URL,
      // gasPrice: process.env.GAS_PRICE,
      accounts: "<private-key>" // Uses the private key from the .env file
    }
  },
  gasReporter: {
    enabled: true,
    currency: "BIT",
    showTimeSpent: true,
    gasPrice: 10,
  },
};
