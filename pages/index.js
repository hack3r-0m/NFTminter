import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../components/Form';
import Success from '../components/Success';

const Index = ({ signerAddress, contract_1155, contract_721, networkId }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [trsHash, setTrsHash] = useState('');
  const [arkaneUrl, setArkaneUrl] = useState('');
  const [err, setErr] = useState('')
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    console.log("inEffect", networkId)
    if (signerAddress && networkId !== 137) {
      setErr('');
      setOpen(true);
    } else setOpen(false);
  }, [networkId])

  return (
    <main className={classes.main}>
      {/** Modal for Network Error */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          {
            err ?
              <Typography variant="h6" style={{ marginBottom: 15, color: 'tomato' }}>
                Error: {err}
              </Typography>
              :
              <Typography variant="h6">
                Your current Network Id is {networkId}. Change it to Matic Mainnet 137.
              </Typography>
          }
        </div>
      </Modal>
      <div className={classes.cont}>
        {
          isLoading && <CircularProgress color="secondary" />
        }
        {
          !trsHash && !isLoading &&
          <Form
            signerAddress={signerAddress}
            contract_1155={contract_1155}
            contract_721={contract_721}
            setIsLoading={setIsLoading}
            setTrsHash={setTrsHash}
            setErr={setErr}
            networkId={networkId}
            setOpen={setOpen}
            setArkaneUrl={setArkaneUrl}
          />
        }
        {
          trsHash &&
          <Success
            trsHash={trsHash}
            setTrsHash={setTrsHash}
            networkId={networkId}
            arkaneUrl={arkaneUrl}
          />
        }
      </div>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    margin: '10px auto',
    marginBottom: 20,
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
    maxWidth: 1300,
    minHeight: 634,
    height: 'max-content',
    margin: 'auto',
    padding: 40,
    background: '#FFFFFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 12px rgba(0, 0, 0, 0.04)',
    borderRadius: 20,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: 10
    },
  }
}));

export default Index;
