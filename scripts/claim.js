const ethers = require("ethers");
require("dotenv").config();

const ClaimableNFT = require("../artifacts/contracts/ClaimableNFT.sol/ClaimableNFT.json");
const { getLatestNonce } = require("./network");

const claim = async (wallet, nonce) => {
  let claimTx = { hash: "0x" };

  try {
    const contract = new ethers.Contract(process.env.NFT_ADDRESS, ClaimableNFT.abi, wallet);
    claimTx = await contract.claim({ nonce });
  } catch (error) {
    console.log("claim error", error.code);
  }

  return claimTx;
};

const claimLoop = async (wallet, num) => {
  const latestNonce = await getLatestNonce(wallet);

  let txs = [];
  for (let i = 1; i <= num; i++) {
    const claimTx = await claim(wallet, latestNonce + i);
    txs.push(claimTx);
  }

  return txs;
};

module.exports = {
  claim: claim,
  claimLoop: claimLoop
};
