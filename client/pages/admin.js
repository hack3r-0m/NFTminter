import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { ethers } from 'ethers';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import Admin from '../components/Admin';


const Index = ({ signerAddress, web3Instance }) => {
  const classes = useStyles();
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const signLogin = async () => {
    try {
      setLoading(true);
      const message = await axios.get(`http://127.0.0.1:8080/nonce?address=${signerAddress}`);
      console.log("sign message", message.data);

      const provider = new ethers.providers.Web3Provider(web3Instance.currentProvider);
      const signer = provider.getSigner();
      const sign = await signer.signMessage(message.data);

      console.log("sign hash", sign);

      const res = await axios("http://127.0.0.1:8080/authenticate", {
        method: "post",
        data: {
          address: signerAddress,
          signature: sign.toString(),
        },
        withCredentials: true
      });

      setToken(res.data);
      setIsAuth(true);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
      setError('AUTH FAILED');
      console.log("AUTH FAILED OR ADMIN KEY NOT ADDED");
    }
  }

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://127.0.0.1:8080/all", {
        headers: {
          address: signerAddress,
          token: token
        }
      });
      console.log(data);
      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
      setError('AUTH FAILED');
    }
  }

  if (loading) {
    return (
      <main className={classes.main}>
        <CircularProgress color="secondary" />
      </main>
    )
  }

  return (
    <React.Fragment>
      <Head>
        <title>NFT Admin | Polygon</title>
      </Head>
      <main className={classes.main}>
        {!isAuth ?
          <Button className={classes.btn} onClick={signLogin}>
            Admin Auth
          </Button> : 'Auth Done!'
        }
        <br />
        {data.length === 0 &&
          <Button className={classes.btn} onClick={getData}>
            Get Data
          </Button>
        }
        {isAuth && data.length > 0 &&
          data.map((item, i) => (
            <Admin
              key={i}
              item={item}
              token={token}
              signerAddress={signerAddress}
            />
          ))
        }
      </main>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    margin: '40px auto',
    minHeight: '50vh',
    maxWidth: 800,
    // textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '20px',
      maxWidth: '90vw',
    },
  },
  btn: {
    maxWidth: 300,
    background: '#061024',
    padding: '10px 16px',
    fontSize: 16,
    color: '#FFFFFF',
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
    '&:hover': {
      background: '#061024',
    }
  },
}));

export default Index;
