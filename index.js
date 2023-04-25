const wallet = require("./scripts/wallet");
const test = require("./scripts/test");
const data = require("./scripts/data");

const argv = require("minimist")(process.argv.slice(2));
const cmd = argv._[0];

if (cmd == "wallet-transfer") {
  if (argv.amount > 0 && argv.from > 0 && argv.to > 0) {
    wallet.transfer(argv.amount, argv.from, argv.to).then(() => {});
  }
}

if (cmd == "wallet-info") {
  if (argv.from >= 0 && argv.to >= 0) wallet.getChildWalletInfo(argv.from, argv.to).then(() => {});
}

if (cmd == "test") {
  if (argv.from > 0 && argv.to > 0) {
    test.run(argv.txs, argv.from, argv.to).catch((err) => console.error(err));
  }
}

if (cmd == "tps") {
  data.calculateTPS("tester").then((rs) => {
    console.log("tps", rs);
  });
}
