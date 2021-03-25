import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {Arkane as AK} from "@arkane-network/web3-arkane-provider";

import { makeStyles } from '@material-ui/core/styles';

// import { useWeb3Modal } from "../hooks/web3";

const abi = require('../config/abi.json');
const abi_1155 = require('../config/abi_1155.json');

const truncateAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const ConnectWallet = ({ signerAddress, setContract_1155, setContract_721, setSignerAddress, setNetworkId }) => {
  const classes = useStyles();
  // const [isWaiting, setWaiting] = useState(false)
  const [provider, setProvider] = useState(undefined);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '196440d5d02d41dfa2a8ee5bfd2e96bd',
      }
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
      }
    }
  };
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    disableInjectedProvider: false,
    providerOptions,
  });

  // Automatically connect if the provider is cashed but has not yet
  // been set (e.g. page refresh)
  if (web3Modal.cachedProvider && !provider) {
    connectWallet();
  }

  async function connectWallet() {
    try {
      const externalProvider = await web3Modal.connect();
      let w3 = new Web3(externalProvider)

      setProvider(w3);
    } catch (e) {
      console.log('NO_WALLET_CONNECTED', e);
    }
  }

  useEffect(() => {
    const getAddress = async () => {
      let web3 = provider;
      const accounts = await web3.eth.getAccounts();
      setSignerAddress(accounts[0]);

      const networkId = await web3.eth.net.getId();
      // console.log(networkId)
      setNetworkId(networkId);

      // for erc721 mainnet and testnet
      setContract_721(new web3.eth.Contract(abi, "0xD05a795d339886bB8Dd46cfe2ac009d7f1E48A64"));
      // for erc1155 mainnet
      if (networkId == "137") setContract_1155(new web3.eth.Contract(abi_1155, "0xd52a86110c9a7597a057Ae2bB4F577B6CD42a639"));
      // for erc1155 testnet
      else setContract_1155(new web3.eth.Contract(abi_1155, "0x692d14f95012778aBb720Be8510f8eAeEaf74F44"));
    }
    if (provider) getAddress();
    else setSignerAddress("");
  }, [provider]);

  const handleClickConnect = async () => {
    await connectWallet();
  };

  const handleClickAddress = () => {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
  };

  return (
    <button
      className={classes.btn}
      onClick={signerAddress ? handleClickAddress : handleClickConnect}>
      <Blockies
        className={classes.img}
        seed={signerAddress.toLowerCase()}
        size={8}
        scale={3}
      />
      <div>
        {signerAddress ? truncateAddress(signerAddress) : "Connect Wallet"}
      </div>
    </button>
  );
}

const useStyles = makeStyles((theme) => ({
  btn: {
    background: 'rgb(183,192,238)',
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    borderRadius: 9999,
    height: 35,
    display: 'flex',
    alignItems: 'center'
  },
  img: {
    borderRadius: 999,
    marginRight: 5
  }
}));

export default ConnectWallet;
