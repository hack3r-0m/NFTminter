import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const ErrorBox = ({ message }) => {
  const classes = useStyles();
  return (
    <div>
      <p className={classes.formError}>
        <b>Error</b>
        <br />
        {message}
      </p>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  formError: {
    fontSize: "17px",
    color: "#ce1212",
    backgroundColor: "#FFDEDE",
    padding: "20px",
    marginTop: "26px",
    borderRadius: "6px",
  },
}));

export default ErrorBox;
