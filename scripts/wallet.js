const { JsonRpcProvider } = require("@ethersproject/providers");
const ethers = require("ethers");
const { getLatestNonce } = require("./network");
require("dotenv").config();

const provider = new JsonRpcProvider(process.env.RPC_URL);

// transfer parent wallet to child wallets
const transfer = async (amountPerWallet, fromIndex, toIndex) => {
  const weiAmount = ethers.utils.parseEther(amountPerWallet.toString());
  const parentWallet = getParentWallet();
  const currentBalance = await parentWallet.provider.getBalance(parentWallet.address);
  console.log(`Parent address: ${parentWallet.address}`);
  console.log(`Parent balance: ${ethers.utils.formatEther(currentBalance)}`);
  let nonce = await getLatestNonce(parentWallet);
  for (let index = fromIndex; index <= toIndex; index++) {
    const recipient = getChildWallet(index);
    const recipientBalance = await parentWallet.provider.getBalance(recipient.address);

    // TODO: estimate transfer amount

    nonce = nonce + 1;
    try {
      await parentWallet.sendTransaction({
        value: weiAmount,
        to: recipient.address,
        // gasLimit: 100000,
        // gasPrice: parseUnits("10", "gwei"),
        nonce: nonce
      });
      console.log(`Transfer`, amountPerWallet, `to child wallet`, index, recipient.address);
    } catch (error) {
      console.log("transfer error", error.code);
    }
  }
};

const getChildWalletInfo = async (fromIndex, toIndex) => {
  for (let index = fromIndex; index <= toIndex; index++) {
    const childWallet = getChildWallet(index);
    const childWalletBalance = await provider.getBalance(childWallet.address);
    console.log(`Child wallet`, index, childWallet.address, `balance`, ethers.utils.formatEther(childWalletBalance));
  }
};

const getParentWallet = () => {
  const parentWalletIndex = 0;
  const parentWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, `m/44'/60'/0'/0/${parentWalletIndex}`).connect(
    provider
  );
  return parentWallet;
};

const getChildWallet = (index) => {
  // const childWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, `m/44'/60'/0'/0/${index}`).connect(provider);
  const childWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, `m/44'/60'/${index}'/0/0`).connect(provider);
  return childWallet;
};

const getWallet = (index, rpcUrl) => {
  const networkProvider = new JsonRpcProvider(rpcUrl);
  const childWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, `m/44'/60'/${index}'/0/0`).connect(networkProvider);
  return childWallet;
};

const createWallet = () => {
  const newWallet = ethers.Wallet.createRandom();
  return newWallet;
};

module.exports = {
  createWallet: createWallet,
  getWallet: getWallet,
  transfer: transfer,
  getParentWallet: getParentWallet,
  getChildWallet: getChildWallet,
  getChildWalletInfo: getChildWalletInfo
};
