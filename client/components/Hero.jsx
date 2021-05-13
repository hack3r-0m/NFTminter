import React from "react";

import { Container, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const Hero = () => {
  const classes = useStyles();

  return (
    <div className={classes.hero}>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} style={{alignItems:'center'}}>
            <Typography variant="h1" className={classes.title}>
              <span>NFT</span> Minter
            </Typography>
            <Typography variant="subtitle1" className={classes.text}>
              Mint NFT on polygon at speed of light!
            </Typography>
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <div className={classes.graphicContainer}>
              <img
                src="/images/graphic.png"
                alt="graphic"
                className={classes.graphic}
              />
            </div>
          </Grid> */}
        </Grid>
      </Container>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  hero: {
    backgroundColor: "#7533E2",
    padding: "70px 0",
    position: "relative",
    overflow: "hidden",

    "&::after": {
      content: "' '",
      top: "-20px",
      left: 0,
      position: "absolute",
      height: "calc(100% + 50px)",
      width: "100%",
      backgroundImage: `url("/images/bg-art.png")`,
      backgroundSize: "78%",
      opacity: "0.15",
    },

    // ["@media (max-width:959px)"]: {
    //   paddingBottom: "120px",
    // },
  },
  title: {
    color: "white",
    marginBottom: "10px",
    "& span": {
      fontWeight: "700",
    },
  },
  text: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#D8C4F7",
    lineHeight: "23px",
    marginBottom:'40px',
    ["@media (max-width:959px)"]: {
      marginBottom: "50px",
    },
  },
  graphicContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  graphic: {
    width: "300px",
    ["@media (max-width:959px)"]: {
      width: "100%",
      float: "none",
    },
    ["@media (max-width:599px)"]: {
      display: "block",
      margin: "auto",
      width: "300px",
    },
    ["@media (max-width:340px)"]: {
      display: "block",
      margin: "auto",
      width: "100%",
    },
  },
}));

export default Hero;
