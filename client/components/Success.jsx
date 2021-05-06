import React, { useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { getRelativeTime } from '../utils/getRelativeTime';

const Success = ({ trsHash, setTrsHash, arkaneUrl }) => {
  const classes = useStyles();
  const url = 'https://explorer-mainnet.maticvigil.com/tx/';

  const [timeLeft, setTimeLeft] = useState(90);
  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div className={classes.root}>
      <img src="img/congratulation.svg" alt="success" />
      <Typography variant="h6" className={classes.title}>
        Congratulation
      </Typography>
      <Typography variant="h6" className={classes.title2}>
        {trsHash === 'ok'
          ? 'We will review your NFT and list shortly'
          : 'Your NFT is minted successfully'
        }
      </Typography>
      {
        trsHash !== 'ok' &&
        <React.Fragment>
          <Typography variant="h6" style={{ marginBottom: 15 }}>
            <a style={{ color: '#8247E5' }}
              rel="noopener noreferrer"
              target="_blank"
              href={url + trsHash}>
              Trs Hash
            </a>
          </Typography>
          <div className={classes.btnGrp}>
            {/* <Button
                className={classes.view}
                href={`https://matic.opensea.io/category/${arkaneUrl}?chainId=137`}
                target="_blank"
              >View on OpenSea
            </Button> */}
            {timeLeft !== 0 &&
              <Typography variant="h6" className={classes.title1}>
                Wait {getRelativeTime(timeLeft)} listing on Arkane
              </Typography>
            }

            {arkaneUrl && timeLeft === 0 &&
              <Button
                href={`https://arkane.market/inventory/MATIC/${arkaneUrl}`}
                target="_blank"
                className={classes.view}
              >View on Arkane</Button>
            }
          </div>
        </React.Fragment>
      }
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
