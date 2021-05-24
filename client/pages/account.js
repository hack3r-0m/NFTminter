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
      setNftData([]);
      let res = await fetch(`https://api.covalenthq.com/v1/137/address/${signerAddress}/balances_v2/?nft=true`,
        { 'stale-while-revalidate': 'max-age=604800' }
      );
      res = await res.json();
      const items = res.data.items;
      console.log(items);
      // filter useful info from api
      const nft = [];
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].nft_data) {
            for (let j = 0; j < items[i].nft_data.length; ++j) {
              const obj = {};
              obj.name = items[i].nft_data[j].external_data?.name;
              obj.image = items[i].nft_data[j].external_data?.image;
              obj.nftType = items[i].nft_data[j].supports_erc[1];
              obj.quantity = items[i].nft_data[j]?.token_balance;
              nft.push(obj);
            }
          } else {
            const obj = {};
            obj.name = items[i].contract_name;
            obj.image = items[i].logo_url;
            obj.nftType = items[i].contract_ticker_symbol;
            nft.push(obj);
          }
        }
      }
      // console.log(nft);
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
            <Grid item xs={12} sm={4} md={3} key={i}>
              <NFTCard
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
  main: {
    backgroundColor: 'white',
    marginTop: '12px',
    paddingBottom: '70px',
    minHeight: '430px',
  },
  title: {
    fontWeight: "bold",
    margin: '30px 0 10px',
  },
}));

export default Account;