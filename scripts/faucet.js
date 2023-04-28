const ethers = require("ethers");
require("dotenv").config();

const faucetABI = {
  BIT: [
    // view methods
    "function totalSupply() view returns (uint totalSupply)",
    "function balanceOf(address who) view returns (uint balance)",
    "function allowance(address owner, address spender) view returns (uint allowance)",
  
    // transaction methods
    "function transfer(address to, uint value)",
    "function transferFrom(address from, address to, uint value)",
    "function approve(address spender, uint value)",
    "function mint(uint256 amount)",
    "function withdraw()",
  
    // events
    "event Transfer(address indexed from, address indexed to, uint value)",
    "event Approval(address indexed owner, address indexed spender, uint value)"
  ]
}

async function mint(wallet) {
  const bitToken = new ethers.Contract(process.env.FAUCET_BIT_ADDRESS, faucetABI.BIT, wallet);
  const weiAmount = ethers.utils.parseEther('1000');
  const tx = await bitToken.mint(weiAmount);
  return tx;
}

async function transfer(fromWallet, toWallet, amount) {
  const bitToken = new ethers.Contract(process.env.FAUCET_BIT_ADDRESS, faucetABI.BIT, fromWallet);
  const weiAmount = ethers.utils.parseEther(amount.toString());
  const tx = await bitToken.transfer(toWallet.address, weiAmount);
  return tx;
}

module.exports = {
  mint : mint,
  transfer: transfer
};
