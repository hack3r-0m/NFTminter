import React, { useState, useEffect } from "react";
import Head from "next/head";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from  "../utils/theme";

import Navbar from "../components/Navbar";
import Footer from "../components/UI/Footer";

const App = ({ Component, pageProps }) => {
  const [contract_1155, setContract_1155] = useState(null);
  const [contract_721, setContract_721] = useState(null);
  const [signerAddress, setSignerAddress] = useState("");
  const [networkId, setNetworkId] = useState("");
  const [web3Instance, setWeb3Instatce] = useState("");
  const [providerMetamask, setProviderMetamask] = useState(null);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Polygon | NFT Minter</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
           <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet"></link>
        </Head>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Navbar
          {...pageProps}
          signerAddress={signerAddress}
          setContract_1155={setContract_1155}
          setContract_721={setContract_721}
          setSignerAddress={setSignerAddress}
          setNetworkId={setNetworkId}
          setProviderMetamask={setProviderMetamask}
          setWeb3Instatce={setWeb3Instatce}
        />
        <Component
          {...pageProps}
          signerAddress={signerAddress}
          contract_1155={contract_1155}
          contract_721={contract_721}
          networkId={networkId}
          providerMetamask={providerMetamask}
          web3Instance={web3Instance}
        />
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
