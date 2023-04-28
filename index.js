const wallet = require("./scripts/wallet");
const test = require("./scripts/test");
const data = require("./scripts/data");
const faucet = require("./scripts/faucet");

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

if (cmd == "bit") {
  if (argv.method != "" && argv.network != "" && argv.from >= 0) {
    let rpcUrl = process.env.RPC_URL;
    if (argv.network.toLowerCase() == "goerli") {
      rpcUrl = process.env.RPC_URL_GOERLI;
    }

    if (argv.method == "faucet") {
      const fromWallet = wallet.getWallet(argv.from, rpcUrl);
      faucet.mint(fromWallet).then((tx) => {
        console.log("mint tx", tx);
      });
    }

    if (argv.method == "transfer" && argv.to >= 0 && argv.amount >= 0) {
      
      const fromWallet = wallet.getWallet(argv.from, rpcUrl);
      const toWallet = wallet.getWallet(argv.to, rpcUrl);
      faucet.transfer(fromWallet, toWallet, argv.amount).then((tx) => {
        console.log("transfer tx", tx);
      });
    }
  }
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
