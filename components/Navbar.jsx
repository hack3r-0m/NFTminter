import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {
  Brightness4Outlined as ToggleDarkModeIcon,
  Brightness5Outlined as ToggleLightModeIcon,
} from "@material-ui/icons/";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

const Navbar = ({ toggleMode, darkMode, signerAddress, contract_1155, contract_721, setContract_1155, setContract_721, setSignerAddress, setNetworkId }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <img src="/logo.svg" alt="logo" className={classes.img} />

        <Typography variant="h6" className={classes.title}>
        </Typography>

        <IconButton
          edge="start"
          color="inherit"
          aria-label="mode"
          onClick={toggleMode}
          className={classes.toggleBtn}
        >
          {darkMode ? <ToggleLightModeIcon htmlColor={theme.custom.palette.iconColor} /> : <ToggleDarkModeIcon htmlColor={theme.custom.palette.iconColor} />}
        </IconButton>

        <ConnectWallet
          signerAddress={signerAddress}
          contract_1155={contract_1155}
          contract_721={contract_721}
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
    maxWidth: 1100,
    boxShadow: 'none'
  },
  img: {
    width: 150,
    marginRight: 20
  },
  title: {
    flexGrow: 1,
    // color: '#784ffe',
    [theme.breakpoints.down('xs')]: {
      fontSize: 0,
      // display: 'none'
    },
  },
  toggleBtn: {
    marginRight: 20,
    [theme.breakpoints.down('xs')]: {
      marginRight: 5,
    },
  }
}));

export default Navbar;