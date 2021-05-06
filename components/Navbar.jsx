import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";

import { AppBar, Container } from "@material-ui/core";
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from "@material-ui/icons/Menu";

import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

const Navbar = ({ signerAddress, setContract_1155, setContract_721, setSignerAddress, setNetworkId }) => {
  const classes = useStyles();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const menuItemContainerRef = useRef(null);
  const toggleMenu = (state) => {
    state
      ? menuItemContainerRef.current.classList.add("open")
      : menuItemContainerRef.current.classList.remove("open");
    setOpenMenu(state);
  };

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>
          <Link href="/" style={{ display: "flex" }}>
            <a> <img src="/logo.svg" alt="logo" className={classes.logo} /> </a>
          </Link>

          <div style={{ display: "flex" }}>
            <div
              className={classes.menuItemContainer}
              ref={menuItemContainerRef}
            >
              <a href="https://polygon-nft-bridge.netlify.app/" className="menuItem">
                Bridge
              </a>
              <Link href="/" style={{ display: "flex" }}>
                <a className={router.pathname == "/" ? "menuItem active" : "menuItem"}> Minter </a>
              </Link>
              <Link href="/account" style={{ display: "flex" }}>
                <a className={router.pathname == "/account" ? "menuItem active" : "menuItem"}> Account </a>
              </Link>
            </div>

            <ConnectWallet
              signerAddress={signerAddress}
              setContract_1155={setContract_1155}
              setContract_721={setContract_721}
              setSignerAddress={setSignerAddress}
              setNetworkId={setNetworkId}
            />
            <MenuIcon
              className={classes.menuIcon}
              onClick={() => {
                openMenu ? toggleMenu(false) : toggleMenu(true);
              }}
            />
          </div>
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
  menuItemContainer: {
    "@media (max-width:599px)": {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      backgroundColor: "white",
      width: "100%",
      top: "80px",
      left: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "all 0.5s ease",
    },

    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
    },

    "& .menuItem": {
      color: "black",
      marginRight: "30px",
      fontSize: "16px",
      textDecoration: "none",
      lineHeight: "36px",
      fontWeight: "600",

      "&.active": {
        color: "#7533E2",
        fontWeight: "bold",
      },

      "&:hover": {
        color: "#7533E2",
        textDecoration: "underline",
      },

      "@media (max-width:599px)": {
        margin: 0,
        textAlign: "center",
        lineHeight: "50px",
      },
    },
  },
  menuIcon: {
    display: "none",
    "@media (max-width:599px)": {
      display: "block",
      color: "black",
      marginLeft: "20px",
      marginTop: "6px",
    },
  },
}));

export default Navbar;
