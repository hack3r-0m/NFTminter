import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";

import { AppBar, Container } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { BridgeIcon, MintIcon } from "./UI/Icons";
import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

const Navbar = ({
  signerAddress,
  setContract_1155,
  setContract_721,
  setSignerAddress,
  setNetworkId,
  setProviderMetamask,
  setWeb3Instatce
}) => {
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

          <div className={classes.navigationSection}>
            <div
              className={classes.menuItemContainer}
              ref={menuItemContainerRef}
            >
              <Link href="/">
                <a className={router.pathname == "/" ? "menuItem active" : "menuItem"}>
                  <MintIcon className="menuItemIcon" />
                  Minter
                </a>
              </Link>
              <Link href="https://bridge.mintnft.today/">
                <a className="menuItem">
                  <BridgeIcon className="menuItemIcon active" />
                  Bridge
                </a>
              </Link>
              <Link href="/account">
                <a className={router.pathname == "/account" ? "menuItem active" : "menuItem"}>
                  <AccountCircleIcon className="menuItemIcon" />
                  Account
                </a>
              </Link>
            </div>

            <ConnectWallet
              signerAddress={signerAddress}
              setContract_1155={setContract_1155}
              setContract_721={setContract_721}
              setSignerAddress={setSignerAddress}
              setNetworkId={setNetworkId}
              setProviderMetamask={setProviderMetamask}
              setWeb3Instatce={setWeb3Instatce}
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
  ...theme.overrides.mui,
  nav: {
    height: "80px",
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "2px solid #7533E2",
    position: "relative",
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
  // everything except the logo inside the navbar.
  navigationSection: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingLeft: '30px',
    "@media (max-width:859px)": {
      justifyContent: 'flex-end',
    }
  },
  menuItemContainer: {
    display: "flex",
    "@media (max-width:859px)": {
      justifyContent: 'space-evenly',
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

    // when the menu is opened in mobile view.
    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
      borderBottom: "2px solid #7533E2",
    },

    // menu items
    "& .menuItem": {
      backgroundColor: "transparent",
      color: "#000",
      marginRight: "15px",
      fontSize: "12px",
      fontWeight: "700",
      textDecoration: "none",
      padding: "0 15px 0 12px",
      border: "1px solid #E8E8E8",
      borderRadius: "19px",
      display: "flex",
      alignItems: "center",
      height: "36px",
      lineHeight: "36px",

      "&.active": {
        backgroundColor: "#8247E5",
        color: "#fff",
        borderColor: "#8247E5",

        "& svg": {
          fill: "#EDF0F7",
        }
      },

      "&:hover": {
        backgroundColor: "#8247E5",
        color: "#fff",
        borderColor: "#8247E5",

        "& svg": {
          fill: "#EDF0F7",
        }
      },

      "@media (max-width:859px)": {
        textAlign: "center",
        lineHeight: "50px",
        marginRight: '0'
      },
    },

    // icons inside the menu Item
    "& .menuItemIcon": {
      width: "20px",
      height: "20px",
      fill: "#6E798F",
      marginRight: "4px",
      transition: 'none',
    },
  },
  menuIcon: {
    display: "none",
    "@media (max-width:859px)": {
      display: "block",
      color: "black",
      marginLeft: "20px",
      marginTop: "6px",
    },
  },
}));

export default Navbar;
