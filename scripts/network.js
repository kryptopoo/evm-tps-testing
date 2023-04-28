const axios = require("axios");
const { JsonRpcProvider } = require("@ethersproject/providers");
require("dotenv").config();

const provider = new JsonRpcProvider(process.env.RPC_URL);

const getLatestNonce = async (wallet) => {
  // const latestTx = await axios.get(`${process.env.SCAN_API_URL}?module=account&action=txlist&address=${wallet.address}&offset=1`);
  // const latestTxRs = latestTx.data
  // const latestTxNonce = Number(latestTxRs.result.length > 0 ? latestTxRs.result[0]?.nonce : 0);
  // console.log('latestTxNonce', latestTxNonce)
  // return latestTxNonce;

  const countNonce = Number(await wallet.getTransactionCount());
  return countNonce - 1;
};

const getTxDetail = async (txHash) => {
  let tx = null;

  try {
    // tx = await provider.getTransaction(txHash);
    // tx = await provider.getTransactionReceipt(txHash);
    const txDetail = await provider.waitForTransaction(txHash, 1, 2000);

    if (txDetail.status != undefined && txDetail.status != 0) {
      // from RPC
      const blockInfo = await provider.getBlock(txDetail.blockNumber);
      tx = {
        txHash: txHash,
        gasUsed: txDetail.gasUsed.toNumber(),
        blockNumber: txDetail.blockNumber,
        timestamp: blockInfo.timestamp
      };
    }
  } catch (error) {
    console.log("getTxDetail error", error.code);
  }

  // try to get via Scan API
  if (tx == null) {
    const txDetailRs = await axios.get(
      `${process.env.SCAN_API_URL}?module=transaction&action=gettxinfo&txhash=${txHash}`
    );
    const txDetail = txDetailRs.data.result;

    if (txDetail.success != undefined && txDetail.success == true) {
      // from SCAN API
      tx = {
        txHash: txHash,
        gasUsed: Number(txDetail.gasUsed),
        blockNumber: Number(txDetail.blockNumber),
        timestamp: Number(txDetail.timeStamp)
      };
    }
  }

  return tx;
};

module.exports = {
  getLatestNonce: getLatestNonce,
  getTxDetail: getTxDetail
};
