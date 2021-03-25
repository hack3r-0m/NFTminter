// import { useState } from 'react'
// import Web3Modal from "web3modal";
// import Web3 from "web3";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Arkane from "@arkane-network/web3-arkane-provider";


// export function useWeb3Modal(web3Modal) {
//   const [provider, setProvider] = useState(undefined);
//   const [error, setError] = useState(null);

//   // Automatically connect if the provider is cashed but has not yet
//   // been set (e.g. page refresh)
//   if (web3Modal.cachedProvider && !provider) {
//     connectWallet();
//   }

//   async function connectWallet() {
//     try {
//       const externalProvider = await web3Modal.connect();
//       let w3 = new Web3(externalProvider)

//       setProvider(w3);
//     } catch (e) {
//       setError('NO_WALLET_CONNECTED');
//       console.log('NO_WALLET_CONNECTED', e);
//     }
//   }

//   function disconnectWallet() {
//     web3Modal.clearCachedProvider();
//     setProvider(undefined);
//   }

//   return { connectWallet, disconnectWallet, provider, error }
// }
