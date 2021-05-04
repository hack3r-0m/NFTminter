import React from 'react';
import Link from 'next/link';

import { AppBar, Container } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

const Navbar = ({ signerAddress, setContract_1155, setContract_721, setSignerAddress, setNetworkId }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>
          <Link href="/" style={{ display: "flex" }}>
            <a> <img src="/logo.svg" alt="logo" className={classes.logo} /> </a>
          </Link>

          <Typography variant="h6" className={classes.title}>
            NFT Minter
          </Typography>

          <div className={classes.divider}></div>

          <Typography variant="h6" className={classes.title2}>
            Mint NFTs for free on Polygon
          </Typography>

          <ConnectWallet
            signerAddress={signerAddress}
            setContract_1155={setContract_1155}
            setContract_721={setContract_721}
            setSignerAddress={setSignerAddress}
            setNetworkId={setNetworkId}
          />
        </div>
      </Container>
    </AppBar>
  )
}

const useStyles = makeStyles((theme) => ({
  nav: {
    height: "80px",
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "2px solid #7533E2",
  },
  container: {
    maxWidth: "1080px",
    margin: "auto",
    padding: "0",
    ["@media (max-width:1120px)"]: {
      padding: "0 20px",
    },
    ["@media (max-width:599px)"]: {
      padding: "0 15px",
    },
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "40px",
    "@media (max-width:599px)": {
      height: "30px",
    },
  },

}));

export default Navbar;
