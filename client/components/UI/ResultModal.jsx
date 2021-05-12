// There are three different outputs of Result Modal for Mapping Form, ETM Form and MTE Form.
// mapping, ethToMatic and maticToEth are the props to be passed.

import React, { useEffect, useState } from "react";

// material ui
import { Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// images
import HexagonGraphic from "./HexagonGraphic";

const ResultModal = ({ minter, triggerModal, setTriggerModal, data }) => {
  const classes = useStyles();
  const [timeLeft, setTimeLeft] = useState(90);

  const url = "https://explorer-mainnet.maticvigil.com/tx/";

  const closeModal = () => {
    setTriggerModal(false);
  };

  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <Modal
      open={triggerModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modalContainer}
    >
      <div className={classes.modal}>
        <div className={classes.closeModal} onClick={closeModal}>
          <Close style={{ fontSize: "16px" }} />
        </div>
        <div className={classes.graphicSection}>
          <div className="iconContainer">
            <img src="/images/thumbs-up.png" alt="thumb icon" />
            <HexagonGraphic color="#1DBA2D" />
          </div>
        </div>
        <div className={classes.textSection}>
          {/* for FormMTE.jsx */}
          {minter && (
            <>
              <p>
                {
                  data.address === 'ok' ?
                    'We will review your NFT and list shortly'
                    : <>
                      <span>Transaction hash:{" "}</span>
                      <span>
                        <a
                          href={`${url}${data.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data.address}
                        </a>
                      </span>
                    </>
                }

              </p>
              {data.arkaneUrl && timeLeft === 0 && (
                <>
                  <p>Wait {timeLeft} seconds for listing on Arkane</p>
                  <button
                    href={`https://arkane.market/inventory/MATIC/${data.arkaneUrl}`}
                    target="_blank"
                    className={`${classes.btn} ${classes.filled}`}
                    style={{margin:'auto',display:'flex'}}
                  >
                    View on Arkane
                  </button>
                </>
              )}
            </>
          )}

          <p className="credit">
            <span>{data.msg}</span>
            <span>
              3d icon from{" "}
              <a href="https://icons8.com/" target="_blank" rel="noreferrer">
                Icons8
              </a>
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.modalStyle,
  purple: {
    color: "#7533E2",
  },
}));

export default ResultModal;
