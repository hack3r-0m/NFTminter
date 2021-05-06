import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const App = ({ Component, pageProps }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [contract_1155, setContract_1155] = useState(null);
  const [contract_721, setContract_721] = useState(null);
  const [signerAddress, setSignerAddress] = useState("");
  const [networkId, setNetworkId] = useState('');

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // Naive check for mobile
    setIsMobile(
      navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      )
    )
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Polygon | NFT Minter</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
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
      />
      <Component
        {...pageProps}
        isMobile={isMobile}
        signerAddress={signerAddress}
        contract_1155={contract_1155}
        contract_721={contract_721}
        networkId={networkId}
      />
      <Footer />
    </React.Fragment>
  );
}

export default App;