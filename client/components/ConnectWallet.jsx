import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import Web3 from "web3";
import Web3Modal, { getInjectedProviderName } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Arkane as AK } from "@arkane-network/web3-arkane-provider";

import { Biconomy } from "@biconomy/mexa";

import { makeStyles } from "@material-ui/core/styles";

// const abi = require('../config/abi.json');
// const abi_1155 = require('../config/abi_1155.json');
const abi_erc721_biconomy = require("../config/abi721-biconomy.json");
const abi_erc1155_biconomy = require("../config/abi1155-biconomy.json");

var web3;

const truncateAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const ConnectWallet = ({
  signerAddress,
  setContract_1155,
  setContract_721,
  setSignerAddress,
  setNetworkId,
  setProviderMetamask,
  setWeb3Instatce,
}) => {
  const classes = useStyles();
  // const [isWaiting, setWaiting] = useState(false)
  const [provider, setProvider] = useState(undefined);
  const [biconomyProvider, setBiconomyProvider] = useState(undefined);
  const [showLogout, setShowLogout] = useState(false);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "196440d5d02d41dfa2a8ee5bfd2e96bd",
      },
    },
    "custom-arkex": {
      display: {
        logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6I2IzMmY5ZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NHB4O30uY2xzLTJ7ZmlsbDojYjMyZjlkO308L3N0eWxlPjwvZGVmcz48dGl0bGU+QnVzaW5lc3MgLSAxNjB4MTYwIC0gY29sb3JlZCB3aXRoIGxpZ2h0IGJhY2tncm91bmQ8L3RpdGxlPjxnIGlkPSJCdXNpbmVzc18tXzE2MHgxNjBfLV9jb2xvcmVkX3dpdGhfbGlnaHRfYmFja2dyb3VuZCIgZGF0YS1uYW1lPSJCdXNpbmVzcyAtIDE2MHgxNjAgLSBjb2xvcmVkIHdpdGggbGlnaHQgYmFja2dyb3VuZCI+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI3Ljk5IiB5PSI3Ljk5IiB3aWR0aD0iMTQ0LjAxIiBoZWlnaHQ9IjE0NC4wMSIgcng9IjEyIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTEwLjczLDc4LjA2Yy0xMy0yMS40Ny0yNS40NS00Mi4yNS0yNi44OC00NC4xOGE1LjcsNS43LDAsMCwwLTMuMjktMi4zOEg3OS41YTUuNjQsNS42NCwwLDAsMC0zLjI5LDIuMzRDNzQuNzQsMzUuNzYsNjIuMjksNTYuNTQsNDkuMzMsNzhjLTE0Ljg5LDI0LjctMzEuMDYsNTAuNDgtMzEuMDYsNTAuNDhIMzQuNDRMNzQuNzIsNjIuNDRzMi43Ny00LjY2LDUuMjctNC41OWgwYzIuNDgtLjA3LDUuMjYsNC41OSw1LjI2LDQuNTlsNDAuMzEsNjYuMDZoMTYuMTdTMTI1LjYzLDEwMi43MiwxMTAuNzMsNzguMDZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNODUuODgsNzUuNTlINzQuMTJhNC40MSw0LjQxLDAsMCwwLDAsOC44Mkg4NS44OGE0LjQxLDQuNDEsMCwxLDAsMC04LjgyWiIvPjwvZz48L3N2Zz4=",
        name: "Arkane",
        description: "Connect to Arkane Wallet",
      },
      package: AK,
      options: {
        clientId: "Polygon",
        secretType: "MATIC",
      },
      connector: async (AK, options) => {
        const provider = await AK.createArkaneProviderEngine(options);
        return provider;
      },
    },
  };
  const web3Modal = new Web3Modal({
    cacheProvider: false,
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

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider("https://matic-mainnet-full-rpc.bwarelabs.com"),
        { apiKey: process.env.biconomy_api_key, debug: true }
      );
      setBiconomyProvider(new Web3(biconomy));

      let w3 = new Web3(externalProvider);
      setProvider(w3);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log("initialized");
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.log(error);
          console.log(message);
        });
    } catch (e) {
      console.log("NO_WALLET_CONNECTED", e);
    }
  }

  const getAddress = async () => {
    if (provider && biconomyProvider) {
      web3 = provider;
      setWeb3Instatce(provider);

      const accounts = await web3.eth.getAccounts();
      setSignerAddress(accounts[0]);

      setContract_721(
        new biconomyProvider.eth.Contract(
          abi_erc721_biconomy,
          "0x72B6Dc1003E154ac71c76D3795A3829CfD5e33b9"
        )
      );
      setContract_1155(
        new biconomyProvider.eth.Contract(
          abi_erc1155_biconomy,
          "0xfd1dBD4114550A867cA46049C346B6cD452ec919"
        )
      );

      const networkId = await web3.eth.net.getId();
      // console.log(networkId)
      setNetworkId(networkId);

      const providerName = await web3.currentProvider.isMetaMask;
      setProviderMetamask(providerName);
      // console.log(providerName);
    } else {
      setSignerAddress("");
    }
  };

  useEffect(() => {
    getAddress();
  }, [provider]);

  // checkNetwork(getAddress, 1000);

  const handleClickConnect = async () => {
    await connectWallet();
  };

  const handleClickAddress = () => {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
    setShowLogout(false);
  };

  const toggleLogoutButton = () => {
    showLogout ? setShowLogout(false) : setShowLogout(true);
  };

  return (
    <div className={classes.walletBtnContainer}>
      <button
        className={classes.walletBtn}
        onClick={signerAddress ? toggleLogoutButton : handleClickConnect}
      >
        <Blockies
          className={`${classes.img } ${signerAddress?'green':'red'}`}
          seed={signerAddress ? signerAddress : ""}
        />
        <div>
          {signerAddress ? truncateAddress(signerAddress) : "Connect Wallet"}
        </div>
      </button>
      {showLogout && (
        <div onClick={handleClickAddress} className={classes.logout}>
          Logout
        </div>
      )}
    </div>
  );
};

export const getSignatureParameters = (signature) => {
  // console.log(signature)
  if (!Web3.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  var r = signature.slice(0, 66);
  var s = "0x".concat(signature.slice(66, 130));
  var v = "0x".concat(signature.slice(130, 132));
  v = Web3.utils.hexToNumber(v);
  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
};

const useStyles = makeStyles((theme) => ({
  walletBtnContainer: {
    display:'flex',
    position:'relative',
  },
  walletBtn: {
    background: "#e3e3e3",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: "18px",
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px 0 8px",
    display: "flex",
    alignItems: "center",

    ["@media (max-width:599px)"]: {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "#000",
      color: "white",
    },

    "& div": {
      ["@media (max-width:599px)"]: {
        margin: 0,
        display: "none",
      },
    },
  },
  img: {
    borderRadius: "12px",
    marginRight: 5,
    height: "24px !important",
    width: "24px !important",

    "&.green":{
      borderColor: 'green',
    },

    "&.red":{
      borderColor: 'red',
    },

    ["@media (max-width:599px)"]: {
      marginRight: 0,
      height: "36px !important",
      width: "36px !important",
      borderRadius: "20px",
      border: '2px solid',
    },
  },
  logout: {
    position: "absolute",
    backgroundColor: "#e3e3e3",
    color: 'black',
    width: "100%",
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px",
    borderRadius: "18px",
    top: "40px",
    right: "0",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: '600',

    "&:hover":{
      color:'white',
      backgroundColor: "#000",
    },

    [theme.breakpoints.down("xs")]:{
      width:'auto',
    }
  },
}));

export default ConnectWallet;
export { web3 };
