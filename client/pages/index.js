import React, { useState } from "react";

// components
import Form from "../components/Form";
import Hero from "../components/Hero";
import ResultModal from "../components/UI/ResultModal";

const Index = ({
  signerAddress,
  contract_1155,
  contract_721,
  providerMetamask,
}) => {
  const [trsHash, setTrsHash] = useState("");
  const [arkaneUrl, setArkaneUrl] = useState("");
  const [triggerModal, setTriggerModal] = useState(false);

  return (
    <>
      <Hero />
      <Form
        signerAddress={signerAddress}
        contract_1155={contract_1155}
        contract_721={contract_721}
        setTrsHash={setTrsHash}
        setTriggerModal={setTriggerModal}
        setArkaneUrl={setArkaneUrl}
        providerMetamask={providerMetamask}
      />

      {/* to display the success message */}
      <ResultModal
        minter
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{
          address: trsHash,
          arkaneUrl: arkaneUrl,
        }}
      />
    </>
  );
};

export default Index;
