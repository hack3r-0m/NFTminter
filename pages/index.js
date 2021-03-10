import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../components/Form';

const Index = ({ signerAddress, contract_1155, contract_721, networkId }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [trsHash, setTrsHash] = useState('');
  const [err, setErr] = useState('')
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    console.log("inEffect", networkId)
    if (signerAddress && networkId.chainId !== 80001) {
      setOpen(true);
    } else setOpen(false);
  }, [networkId])

  return (
    <main className={classes.main}>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography variant="h6">
            Your current Network is {networkId.name} (chain id {networkId.chainId}). Change it to Matic testnet 80001 or Matic mainnet 137.
          </Typography>
        </div>

      </Modal>
      <div className={classes.title}>
        <Typography variant="h3" style={{ marginBottom: 5 }}>NFT Minter</Typography>
        <Typography variant="h6" style={{ opacity: 0.5 }}>Mint ERC721 or ERC1155 standard tokens on Polygon (Previously Matic Network) </Typography>
      </div>
      {
        trsHash && <Typography variant="h6" style={{ marginBottom: 15 }}>
          🎊 NFT minted 🎉{'  '}
          <a style={{ color: '#ee6f57' }}
            rel="noopener noreferrer"
            target="_blank"
            href={`https://explorer-mumbai.maticvigil.com/tx/` + trsHash}>
            Trs Hash
        </a>
        </Typography>
      }
      {
        err && <Typography variant="h6" style={{ marginBottom: 15, color: 'tomato' }}>
          🛑 Error: {'  ⚠️ '} {err}
        </Typography>
      }
      <div className={classes.cont}>
        {
          isLoading ? <CircularProgress color="secondary" />
            :
            <Form
              signerAddress={signerAddress}
              contract_1155={contract_1155}
              contract_721={contract_721}
              setIsLoading={setIsLoading}
              setTrsHash={setTrsHash}
              setErr={setErr}
              networkId={networkId}
              setOpen={setOpen}
            />
        }
      </div>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    margin: '0px auto',
    marginBottom: 20,
    maxWidth: 1100,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '20px'
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    top: '45%',
    left: '37%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  title: {
    marginBottom: 20
  },
  cont: {
    maxWidth: 540,
    margin: 'auto',
    border: `1px solid ${theme.custom.palette.iconColor}`,
    boxShadow: '2.5px 5px',
    borderRadius: 8,
    width: '100%',
    // background: 'rgba(27, 27, 50, 0.1)',
    // backgroundColor: 'rgb(183,192,238,0.1)',
    height: 'max-content',
    padding: 20,
    [theme.breakpoints.down('xs')]: {
      width: '95%'
    },
  }
}));

export default Index;
