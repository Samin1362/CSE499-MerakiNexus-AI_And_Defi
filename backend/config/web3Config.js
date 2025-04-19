import Web3 from 'web3';

const web3Config = () => {
  // Use Ganache's local RPC endpoint
  const ganacheUrl = 'http://127.0.0.1:7545';  // Default Ganache local RPC URL
  const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

  // Optional: Log the current network to ensure the connection is successful
  web3.eth.net.getId()
    .then((networkId) => {
      // Adjust to the exact network ID returned by Ganache
      if (networkId === 5777n) { // Default Ganache network ID
        console.log('Connected to Ganache testnet');
      } else {
        console.log('Not connected to Ganache testnet. Network ID:', networkId);
      }
    })
    .catch(err => {
      console.error('Error connecting to network:', err);
    });

  return web3;
};

export default web3Config;



