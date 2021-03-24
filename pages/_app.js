import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { darkTheme, lightTheme } from '../utils/theme';
import Navbar from '../components/Navbar';

const App = ({ Component, pageProps }) => {
  const [darkMode, setDarkMode] = useState(0);
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
    // Setup darkmode
    setDarkMode(
      localStorage.getItem('mode')
        ? parseInt(localStorage.getItem('mode'))
        : 0
    )
    // Naive check for mobile
    setIsMobile(
      navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      )
    )
  }, []);

  const toggleMode = () => {
    localStorage.setItem('mode', (1 - darkMode).toString())
    setDarkMode(1 - darkMode)
  }

  const muiTheme = darkMode ? darkTheme : lightTheme;

  return (
    <React.Fragment>
      <Head>
        <title>Polygon NFT Minter</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={muiTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Navbar
          {...pageProps}
          darkMode={darkMode}
          toggleMode={toggleMode}
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
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;