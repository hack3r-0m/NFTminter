import React, { useState } from "react";

// material ui
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";

// components
import Form from "../components/Form";
import Success from "../components/Success";
import Hero from "../components/Hero";
import ResultModal from "../components/UI/ResultModal";

const Index = ({
  signerAddress,
  contract_1155,
  contract_721,
  providerMetamask,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trsHash, setTrsHash] = useState("");
  const [arkaneUrl, setArkaneUrl] = useState("something");
  const [open, setOpen] = React.useState(false);
  const [triggerModal, setTriggerModal] = useState(true);

  // result modal
  const openModal = () => {
    setTriggerModal(true);
  };

  return (
    <>
      <Hero />
      <div>
        {isLoading && <CircularProgress color="secondary" />}
        {!trsHash && !isLoading && (
          <Form
            signerAddress={signerAddress}
            contract_1155={contract_1155}
            contract_721={contract_721}
            setIsLoading={setIsLoading}
            setTrsHash={setTrsHash}
            setOpen={setOpen}
            setArkaneUrl={setArkaneUrl}
            providerMetamask={providerMetamask}
          />
        )}
      
        {/* to display the success message */}
        {trsHash && openModal()}
        <ResultModal
          minter
          triggerModal={triggerModal}
          setTriggerModal={setTriggerModal}
          data={{
            address: trsHash,
            arkaneUrl: arkaneUrl,
          }}
        />
      </div>
    </>
  );
};

export default Index;
