import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Web3 from 'web3';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const Index = ({ signerAddress, web3Instance }) => {
  const classes = useStyles();
  const [isAuth, setIsAuth] = useState(false);

  // useEffect(() => {
  //   const getUser = async () => { 
  //   }
  //   if (signerAddress) getUser();
  // }, [signerAddress])

  const signLogin = async () => {
    try {
      const message = await axios.get(`http://127.0.0.1:8080/nonce?address=${signerAddress}`);
      console.log(message.data);

      const web3 = new Web3(web3Instance);
      console.log(web3Instance)
      // await web3.eth.currentProvider.send;
      const sign = await web3.eth.sign(message.data, signerAddress);
      console.log(sign);
      const res = await axios.post(`http://127.0.0.1:8080/authenticate`, {
        withCredentials: true,
        credentials: "include",
        address: signerAddress,
        signature: sign.toString(),
      });
      if (res.status === 200) {
        console.log(res)
        setIsAuth(true);
      }
    } catch (e) {
      console.error(e);
      console.log("AUTH FAILED OR ADMIN KEY NOT ADDED");
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>NFT Admin | Polygon</title>
      </Head>
      <main className={classes.main}>
        <Button onClick={signLogin}>Auth Check</Button>
        {isAuth && yeahh}

      </main>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    margin: '40px auto',
    minHeight: '100%',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '20px'
    },
  },
}));

export default Index;
