import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress, Container, Grid, Modal } from "@material-ui/core/";
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import NFTCard from "../components/UI/NFTCard";

const Account = ({ signerAddress }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [nftData, setNftData] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [modalImgProps, setModalImgProps] = useState({});

  const closeModal = () => {
    setModalState(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setNftData([]);
      let { data } = await axios({
        method: 'get',
        url: `https://api.covalenthq.com/v1/137/address/${signerAddress}/balances_v2/?nft=true`,
        headers: {
          'Authorization': `Basic ${process.env.covalent_key}`
        }
      });
      const items = data.data.items;
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
    };
    if (signerAddress) fetchData();
  }, [signerAddress]);

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
                setModalState={setModalState}
                setModalImgProps={setModalImgProps}
              />
            </Grid>
          ))}
        </Grid>
        {/* to view the image */}
        <Modal
          open={modalState}
          className={`${classes.modalContainer} ${modalImgProps.portrait ? classes.portrait : ''
            }`}
          onClose={closeModal}
        >
          <div className={`${classes.modal} modal`}>
            <div className={classes.closeModal} onClick={closeModal}>
              <Close style={{ fontSize: "16px" }} />
            </div>
            <img
              src={modalImgProps.img}
              alt="nft display"
              className={classes.img}
            />
          </div>
        </Modal>
        {isLoading && <CircularProgress color="secondary" />}
      </Container>
    </main>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  ...theme.overrides.modalStyle,
  main: {
    backgroundColor: "white",
    marginTop: "12px",
    paddingBottom: "70px",
    minHeight: "430px",
  },
  title: {
    fontWeight: "bold",
    margin: "30px 0 10px",
  },
  img: {
    borderRadius: "5px",
  },
  portrait: {
    "& .modal": {
      width: 'auto',
      height: '90%',

      "& img": {
        width: 'auto',
        height: '100%',
      }
    }
  }
}));

export default Account;
