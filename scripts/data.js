const fs = require("fs");
const { getTxDetail } = require("./network");
require("dotenv").config();

const store = async (name, txHashes) => {
  try {
    fs.writeFile(`./data/${name}.json`, JSON.stringify({ txs: txHashes }, null, 4), (error) => {
      if (error) console.log("write file error", error);
    });
  } catch (e) {
    console.log("write file error", error);
  }
};

const calculateTPS = async (name) => {
  let tps = {
    total: 0,
    duration: 0,
    tps: 0
  };

  let txs = [];

  if (fs.existsSync(`./data/${name}.json`)) {
    let content = fs.readFileSync(`./data/${name}.json`).toString();
    txs = JSON.parse(content).txs;
  } else {
    const files = fs.readdirSync(`./data`);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let content = fs.readFileSync(`./data/${file}`).toString();
      let jsonTxs = JSON.parse(content).txs;
      for (let index = 0; index < jsonTxs.length; index++) {
        const txHash = jsonTxs[index];
        if (txHash != "" && txHash != "0x") {
          const txDetail = await getTxDetail(txHash);
          if (txDetail != null) txs.push(txDetail);
        }
      }
    }

    try {
      fs.writeFile(`./data/${name}.json`, JSON.stringify({ txs: txs }, null, 4), (error) => {
        if (error) console.log("write file error", error);
      });
    } catch (e) {
      console.log("write file error", error);
    }
  }

  const sortTxs = txs.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
  tps.total = sortTxs.length;
  // tps.duration = sortTxs[sortTxs.length - 1].timestamp - sortTxs[0].timestamp;
  // tps.tps = Number(tps.duration > 0 ? (tps.total / tps.duration).toFixed() : tps.total);

  const groupByTimestamp = txs.reduce((group, tx) => {
    const { timestamp } = tx;
    group[timestamp] = group[timestamp] ?? [];
    group[timestamp].push(tx);
    return group;
  }, {});

  try {
    fs.writeFile(`./data/${name}_tps.json`, JSON.stringify(groupByTimestamp, null, 4), (error) => {
      if (error) console.log("write file error", error);
    });
  } catch (e) {
    console.log("write file error", error);
  }

  tps.tps = 0;
  for (const item in groupByTimestamp) {
    if (tps.tps < groupByTimestamp[item].length) tps.tps = groupByTimestamp[item].length;
  }

  return tps;
};

module.exports = {
  store: store,
  calculateTPS: calculateTPS
};
