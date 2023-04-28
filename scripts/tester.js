const { claimLoop } = require("./claim");
const data = require("./data");
require("dotenv").config();

const { workerData, parentPort } = require("worker_threads");
const Wallet = require("./wallet");

parentPort.postMessage(test(workerData));

function test(workerData) {
  const wallet = Wallet.getChildWallet(workerData.index);
  console.log(`tester`, workerData.index, `start`, wallet.address);

  // run
  Promise.all([claimLoop(wallet, workerData.totalTx)]).then(([all]) => {
    const txs = all.map((item) => item.hash);
    // console.log("txs", txs);
    // return txs;

    // store
    data.store(`tester_${workerData.index}`, txs).then(() => {
      console.log(`tester`, workerData.index, `done`);
    });
  });
}
