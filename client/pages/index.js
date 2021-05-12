import React, { useState, useEffect } from "react";

// material ui
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

// components
import Form from "../components/Form";
import Success from "../components/Success";
import Hero from "../components/Hero";

const Index = ({
  signerAddress,
  contract_1155,
  contract_721,
  providerMetamask,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trsHash, setTrsHash] = useState("");
  const [arkaneUrl, setArkaneUrl] = useState("");
  const [err, setErr] = useState("");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Hero />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div>
          <Typography
            variant="h6"
            style={{ marginBottom: 15, color: "tomato" }}
          >
            Error: {err}
          </Typography>
        </div>
      </Modal>
      <div>
        {isLoading && <CircularProgress color="secondary" />}
        {!trsHash && !isLoading && (
          <Form
            signerAddress={signerAddress}
            contract_1155={contract_1155}
            contract_721={contract_721}
            setIsLoading={setIsLoading}
            setTrsHash={setTrsHash}
            setErr={setErr}
            setOpen={setOpen}
            setArkaneUrl={setArkaneUrl}
            providerMetamask={providerMetamask}
          />
        )}
        {trsHash && (
          <Success
            trsHash={trsHash}
            setTrsHash={setTrsHash}
            arkaneUrl={arkaneUrl}
          />
        )}
      </div>
    </>
  );
};

export default Index;
