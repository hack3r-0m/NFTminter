import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {Arkane as AK} from "@arkane-network/web3-arkane-provider";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "196440d5d02d41dfa2a8ee5bfd2e96bd",
        },
    },
    "custom-arkex": {
        display: {
            logo:
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6I2IzMmY5ZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NHB4O30uY2xzLTJ7ZmlsbDojYjMyZjlkO308L3N0eWxlPjwvZGVmcz48dGl0bGU+QnVzaW5lc3MgLSAxNjB4MTYwIC0gY29sb3JlZCB3aXRoIGxpZ2h0IGJhY2tncm91bmQ8L3RpdGxlPjxnIGlkPSJCdXNpbmVzc18tXzE2MHgxNjBfLV9jb2xvcmVkX3dpdGhfbGlnaHRfYmFja2dyb3VuZCIgZGF0YS1uYW1lPSJCdXNpbmVzcyAtIDE2MHgxNjAgLSBjb2xvcmVkIHdpdGggbGlnaHQgYmFja2dyb3VuZCI+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI3Ljk5IiB5PSI3Ljk5IiB3aWR0aD0iMTQ0LjAxIiBoZWlnaHQ9IjE0NC4wMSIgcng9IjEyIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTEwLjczLDc4LjA2Yy0xMy0yMS40Ny0yNS40NS00Mi4yNS0yNi44OC00NC4xOGE1LjcsNS43LDAsMCwwLTMuMjktMi4zOEg3OS41YTUuNjQsNS42NCwwLDAsMC0zLjI5LDIuMzRDNzQuNzQsMzUuNzYsNjIuMjksNTYuNTQsNDkuMzMsNzhjLTE0Ljg5LDI0LjctMzEuMDYsNTAuNDgtMzEuMDYsNTAuNDhIMzQuNDRMNzQuNzIsNjIuNDRzMi43Ny00LjY2LDUuMjctNC41OWgwYzIuNDgtLjA3LDUuMjYsNC41OSw1LjI2LDQuNTlsNDAuMzEsNjYuMDZoMTYuMTdTMTI1LjYzLDEwMi43MiwxMTAuNzMsNzguMDZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNODUuODgsNzUuNTlINzQuMTJhNC40MSw0LjQxLDAsMCwwLDAsOC44Mkg4NS44OGE0LjQxLDQuNDEsMCwxLDAsMC04LjgyWiIvPjwvZz48L3N2Zz4=",
            name: "Arkane",
            description: "Connect to Arkane Wallet",
        },
        package: AK,
        options: {
            clientId: "Polygon",
            signMethod: 'POPUP',
            secretType: "MATIC"

        },
        connector: async (AK, options) => {
            const provider = await AK.createArkaneProviderEngine(options);
            return provider;
        },
    },
};

const web3Modal = new Web3Modal({
    network: "kovan",
    cacheProvider: false,
    disableInjectedProvider: false,
    providerOptions,
  });
  
  export function useWeb3Modal() {
    const [provider, setProvider] = useState(undefined);
    const [error, setError] = useState(null);
  
    // Automatically connect if the provider is cashed but has not yet
    // been set (e.g. page refresh)
    if (web3Modal.cachedProvider && !provider) {
      connectWallet();
    }
  
    async function connectWallet() {
      try {
        const externalProvider = await web3Modal.connect();
        console.log(externalProvider)
        const ethersProvider = new ethers.providers.Web3Provider(externalProvider);
        console.log(ethersProvider)

        setProvider(ethersProvider);

      } catch(e) {
        setError('NO_WALLET_CONNECTED');
        console.log('NO_WALLET_CONNECTED', e);
      }
    }
  
    function disconnectWallet() {
      web3Modal.clearCachedProvider();
      setProvider(undefined);
    }
  
    return { connectWallet, disconnectWallet, provider, error }
  }
  
