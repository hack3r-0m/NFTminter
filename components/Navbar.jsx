import React from 'react';

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
      <Toolbar>
        <img src="/logo.svg" alt="logo" className={classes.img} />

        <Typography variant="h6" className={classes.title}>
          NFT Minter
        </Typography>

        <div className={classes.divider}></div>

        <Typography variant="h6" className={classes.title2}>
          Mint ERC721 or ERC1155 standard tokens on Polygon
        </Typography>

        <div className={classes.gap}></div>

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
    [theme.breakpoints.down('sm')]: {
      padding: 10,
    },
  },
  img: {
    width: 150,
    marginRight: 20
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
  }
}));

export default Navbar;
