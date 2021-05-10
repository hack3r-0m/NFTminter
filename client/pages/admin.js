import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { ethers } from 'ethers';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import Admin from '../components/Admin';

axios.defaults.withCredentials = true;

const Index = ({ signerAddress, web3Instance }) => {
  const classes = useStyles();
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(d);
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

      const res = await axios.post(`http://127.0.0.1:8080/authenticate`, {
        withCredentials: true,
        credentials: "include",
        address: signerAddress,
        signature: sign.toString(),
      });
      if (res.status === 200) {
        console.log(res.data)
        setIsAuth(true);
      }
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
      const res = await axios.get("http://127.0.0.1:8080/all", {
        withCredentials: true,
        credentials: "include",
      });
      console.log(res);
      // setData(res.data);
    } catch (e) {
      console.error(e);
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
        {
          !isAuth && <Button className={classes.btn} onClick={signLogin}>
            Admin AUth
          </Button>
        }
        <Button className={classes.btn} onClick={getData}>
          Get Data
        </Button>
        {isAuth && data.length > 0 &&
          data.map((item, i) => (
            <Admin key={i} item={item} />
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
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '20px'
    },
  },
  btn: {
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
}));

export default Index;

const d = [
  {
    description: "description",
    external_url: null,
    image: "image",
    name: "name",
    _id: "6087cb05ec8d560ad8152737",
  },
  {
    description: "description",
    external_url: null,
    image: "image",
    name: "name",
    _id: "6087cb05ec8d560ad8152737",
  },
  {
    description: "description",
    external_url: null,
    image: "image",
    name: "name",
    _id: "6087cb05ec8d560ad8152737",
  },
  {
    description: "description",
    external_url: null,
    image: "image",
    name: "name",
    _id: "6087cb05ec8d560ad8152737",
  }
]