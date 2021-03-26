import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const Success = ({ networkId, trsHash, setTrsHash }) => {
  const classes = useStyles();

  const url = networkId === 137 ? 'https://explorer-mainnet.maticvigil.com/tx/' : 'https://explorer-mumbai.maticvigil.com/tx/'

  return (
    <div className={classes.root}>
      <img src="img/congratulation.svg" alt="success" />
      <Typography variant="h6" className={classes.title}>
        Congratulation
      </Typography>
      <Typography variant="h6" className={classes.title2}>
        Your NFT is minted successfully
      </Typography>
      <Typography variant="h6" style={{ marginBottom: 15 }}>
        <a style={{ color: '#8247E5' }}
          rel="noopener noreferrer"
          target="_blank"
          href={url + trsHash}>
          Trs Hash
        </a>
      </Typography>
      <div className={classes.btnGrp}>
        <Button className={classes.view}>View on OpenSea</Button>
        <Button href="https://arkane.market/inventory/MATIC/{contract_address}/{tokenID}" className={classes.view}>View on Arkane</Button>
      </div>
      <Button
        className={classes.more}
        onClick={() => setTrsHash('')}
      >Mint more</Button>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '7%',
    [theme.breakpoints.down('md')]: {
      padding: 20,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
  },
  title2: {
    maxWidth: 300,
    textAlign: 'center',
    margin: 'auto',
    fontSize: 16,
    fontWeight: 400,
  },
  btnGrp: {
    display: 'flex',
    justifyContent: 'space-evenly',
    maxWidth: 500,
    margin: 'auto',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    },
  },
  view: {
    maxWidth: 300,
    background: '#061024',
    padding: '10px 16px',
    fontSize: 16,
    color: '#FFFFFF',
    borderRadius: 37,
    marginTop: 10,
    marginRight: 10,
    '&:hover': {
      background: '#061024',
    }
  },
  more: {
    maxWidth: 300,
    background: '#8247E5',
    padding: '12px 35px',
    fontSize: 16,
    color: '#FFFFFF',
    borderRadius: 37,
    marginTop: 20,
    '&:hover': {
      background: '#8247E5',
    }
  }
}));


export default Success;
