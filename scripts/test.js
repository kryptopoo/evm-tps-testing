const { Worker } = require("worker_threads");

function runTester(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./scripts/tester.js", { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function run(totalTx, fromIndex, toIndex) {
  for (let index = fromIndex; index <= toIndex; index++) {
    const workerData = { index: index, totalTx: totalTx };
    const result = await runTester(workerData);
  }
}

module.exports = {
  run: run
};
