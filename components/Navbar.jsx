import React from 'react';
import Link from 'next/link';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

const Navbar = ({ signerAddress, setContract_1155, setContract_721, setSignerAddress, setNetworkId }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar className={classes.rootTool}>
        <Link href="/">
          <a>
            <img src="/logo.svg" alt="logo" className={classes.img} />
          </a>
        </Link>

        <Typography variant="h6" className={classes.title}>
          NFT Minter
        </Typography>

        <div className={classes.divider}></div>

        <Typography variant="h6" className={classes.title2}>
          Mint NFTs for free on Polygon
        </Typography>

        <div className={classes.gap}></div>

        <div className={classes.social}>
          <a href="https://discord.gg/ZnakscDVGe" target="_blank" rel="noopener noreferrer">
            <img src="/img/discord.svg" className={classes.socialImg} />
          </a>
        </div>
        <ConnectWallet
          signerAddress={signerAddress}
          setContract_1155={setContract_1155}
          setContract_721={setContract_721}
          setSignerAddress={setSignerAddress}
          setNetworkId={setNetworkId}
        />
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
    backgroundColor: '#F8F9FA',
    padding: '10px 70px',
    boxShadow: 'none',
    [theme.breakpoints.down('xs')]: {
      padding: '10px 0px',
    },
  },
  rootTool: {
    [theme.breakpoints.down('xs')]: {
      padding: '0px 5px',
    },
  },
  img: {
    width: 150,
    marginRight: 20,
    [theme.breakpoints.down('xs')]: {
      width: 130,
    },
  },
  title: {
    // fontFamily: 'Manrope',
    fontWeight: 400,
    fontSize: 22,
    color: '#061024',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  divider: {
    width: 36,
    border: '0.9px solid #8247E5',
    transform: 'rotate(90deg)',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  title2: {
    fontWeight: 'normal',
    fontSize: 17,
    color: '#061024',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  gap: {
    flexGrow: 1,
  },
  social: {
    // position: 'absolute',
    display: 'flex',
    right: 20,
    [theme.breakpoints.down('xs')]: {
      right: 0
    },
  },
  socialImg: {
    width: 35,
    display: 'block',
    margin: 'auto',
    marginRight: 10,
    [theme.breakpoints.down('xs')]: {
      marginRight: 4,
    },
  },
}));

export default Navbar;
