import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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
      console.log(nft)
      setNftData(nft);
      setIsLoading(false);
    }
    if (signerAddress) fetchData();
  }, [signerAddress])

  return (
    <main className={classes.main}>
      <div className={classes.cont}>
        <Typography className={classes.title}>
          Your Account
        </Typography>

        <div className={classes.grid}>
          {nftData.map((nft, i) => (
            <div className={classes.nftBox} key={i}>
              <img src={nft.image || "img/no-photo.svg"} className={classes.nftImg} alt="image" />
              <div className={classes.nftDetails}>
                <Typography className={classes.nftTitle}>
                  {nft.name}
                </Typography>
                <div className={classes.nftSubTitle}>
                  <span>{nft.nftType}</span>
                  <span>{nft.quantity && nft.nftType === 'erc1155' && 'Quantity: ' + nft.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isLoading && <CircularProgress color="secondary" />}
      </div>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '90%',
    margin: '40px auto',
    minHeight: '100%',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '20px'
    },
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
    // fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#061024',
    textAlign: 'left'
  },
  grid: {
    flexWrap: 'wrap',
    display: 'grid',
    gridGap: '1.25rem',
    gridTemplateColumns: 'repeat(3, 1fr)',
    marginTop: '2rem',
    transition: '0.4s ease-in-out',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  nftBox: {
    width: '90%',
    height: 368,
    padding: 32,
    margin: 'auto',
    background: '#FFFFFF',
    boxShadow: '0px 2px 4px rgb(0 0 0 / 8%), 0px 8px 12px rgb(0 0 0 / 4%)',
    borderRadius: 20,
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  nftImg: {
    width: '100%',
    objectFit: 'contain',
    height: 246,
  },
  nftTitle: {
    marginTop: 16,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#061024',
    textAlign: 'left'
  },
  nftSubTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
    textTransform: 'uppercase'
  }
}));

export default Account;
