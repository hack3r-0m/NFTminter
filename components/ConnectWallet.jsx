import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Arkane from "@arkane-network/web3-arkane-provider";

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
    arkane: {
      package: Arkane,
      options: {
        clientId: "Polygon",
        environment: "staging"
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