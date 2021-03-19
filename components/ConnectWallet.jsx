import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Blockies from "react-blockies";

import { makeStyles } from '@material-ui/core/styles';

import { useWeb3Modal } from "../hooks/web3";

const abi = require('../config/abi.json');
const abi_1155 = require('../config/abi_1155.json');

const truncateAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const ConnectWallet = ({ signerAddress, contract_1155, contract_721, setContract_1155, setContract_721, setSignerAddress , setNetworkId}) => {
  const classes = useStyles();
  // const [isWaiting, setWaiting] = useState(false)
  // const [isSent, setSent] = useState(false)
  // const [walletNotDetected, setWalletNotDetected] = useState(false)

  const { connectWallet, disconnectWallet, provider, error } = useWeb3Modal();

  useEffect(() => {
    const getAddress = async () => {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSignerAddress(address);

      const networkId = await provider.getNetwork();
      console.log(networkId)
      setNetworkId(networkId);
      // if(chainId !== 8001)

      // for erc721 mainnet and testnet
      setContract_721(new ethers.Contract("0xD05a795d339886bB8Dd46cfe2ac009d7f1E48A64", abi));

      // for erc1155 mainnet
      if (networkId == "137") setContract_1155(new ethers.Contract("0xd52a86110c9a7597a057Ae2bB4F577B6CD42a639", abi_1155));
      // for erc1155 testnet
      else setContract_1155(new ethers.Contract("0x692d14f95012778aBb720Be8510f8eAeEaf74F44", abi_1155));

      console.log(contract_721, contract_1155)
    }
    if (provider) getAddress();
    else setSignerAddress("");
  }, [provider]);

  const handleClickConnect = async () => {
    await connectWallet();
  };

  const handleClickAddress = () => {
    disconnectWallet();
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