import React, { useState, useEffect } from "react";

import {
  CircularProgress,
  Container,
  Grid,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

import NFTCard from "../components/UI/NFTCard";

const Account = ({ signerAddress }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [nftData, setNftData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(`https://api.covalenthq.com/v1/137/address/${signerAddress}/balances_v2/?nft=true`,
        { 'stale-while-revalidate': 'max-age=604800' }
      );
      const { data } = await res.json();
      console.log(data);
      const nft = [];
      if (data.items.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
          const obj = {};
          // console.log(data.items[i])
          if (data.items[i].nft_data) {
            obj.name = data.items[i].nft_data[0].external_data?.name;
            obj.image = data.items[i].nft_data[0].external_data?.image;
            obj.nftType = data.items[i].nft_data[0].supports_erc[1];
            obj.quantity = data.items[i].nft_data[0]?.token_balance;
          } else {
            obj.name = data.items[i].contract_name;
            obj.image = data.items[i].logo_url;
            obj.nftType = data.items[i].contract_ticker_symbol;
          }
          nft.push(obj);
        }
      }
      console.log(nft);
      setNftData(nft);
      setIsLoading(false);
    }
    if (signerAddress) fetchData();
  }, [signerAddress])

  return (
    <main className={classes.main}>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1 className={classes.title}>My account</h1>
          </Grid>
          {nftData.map((nft, i) => (
            <Grid item xs={12} sm={6} md={4}>
              <NFTCard
                key={i}
                image={nft.image}
                name={nft.name}
                type={nft.nftType}
                quantity={nft.quantity}
              />
            </Grid>
          ))}
        </Grid>
        {isLoading && <CircularProgress color="secondary" />}
      </Container>
    </main>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui, 
  main:{
    backgroundColor: 'white',
    marginTop:'12px',
    paddingBottom:'70px',
    minHeight:'430px',
  },
  title: {
    fontWeight: "bold",
    margin:'30px 0 10px',
  },
}));

export default Account;