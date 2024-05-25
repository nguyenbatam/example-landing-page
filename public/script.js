const connectButton = document.getElementById('connectButton');
const walletAddressSpan = document.getElementById('walletAddress');
const ethBalanceSpan = document.getElementById('ethBalance');
const usdtBalanceSpan = document.getElementById('usdtBalance');

let web3;
let infuraWeb3;
let accounts;

const infuraUrl = 'https://mainnet.infura.io/v3/cbd015012ddf44378169a44e6f80d2b0';

infuraWeb3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

connectButton.addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    // MetaMask
    web3 = new Web3(window.ethereum);
    try {
      // accounts
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      walletAddressSpan.textContent = accounts[0];
      getBalances(accounts[0]);
    } catch (error) {
      console.error("User denied access to account", error);
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask and try again.');
  }
});

async function getBalances(address) {
  try {
    const ethBalance = await infuraWeb3.eth.getBalance(address);
    ethBalanceSpan.textContent = infuraWeb3.utils.fromWei(ethBalance, 'ether') + ' ETH';

    const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const usdtAbi = [
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
      }
    ];
    const usdtContract = new infuraWeb3.eth.Contract(usdtAbi, usdtContractAddress);
    const usdtBalance = await usdtContract.methods.balanceOf(address).call();
    usdtBalanceSpan.textContent = infuraWeb3.utils.fromWei(usdtBalance, 'mwei') + ' USDT';
  } catch (error) {
    console.error('Error fetching balance', error);
  }
}
