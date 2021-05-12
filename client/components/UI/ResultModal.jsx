// There are three different outputs of Result Modal for Mapping Form, ETM Form and MTE Form.
// mapping, ethToMatic and maticToEth are the props to be passed.

import React from "react";

// material ui
import { Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// images
import thumbsUp from "../../images/thumbs-up.png";
import thumbsDown from "../../images/thumbs-down.png";
import HexagonGraphic from "./HexagonGraphic";

const ResultModal = ({
  mapping,
  maticToEth,
  ethToMatic,
  triggerModal,
  setTriggerModal,
  data,
}) => {
  const classes = useStyles();

  const closeModal = () => {
    setTriggerModal(false);
  };

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
            <img
              src={mapping ? (data.mapped ? thumbsUp : thumbsDown) : thumbsUp}
              alt="thumb icon"
            />
            <HexagonGraphic
              color={
                mapping ? (data.mapped ? "#1DBA2D" : "#BA301D") : "#1DBA2D"
              }
            />
          </div>
        </div>
        <div className={classes.textSection}>
          {/* for FormMapping.jsx */}
          {mapping && (
            <p>
              Address <span>{data.address}</span>
              is {data.mapped ? "mapped" : "not yet mapped"}.
            </p>
          )}

          {/* for FormMTE.jsx */}
          {maticToEth && (
            <p>
              Transaction hash:{" "}
              <span>
                <a
                  href={`${data.url}${data.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.address}
                </a>
              </span>
            </p>
          )}

          {/* for FormETM.jsx */}
          {ethToMatic && (
            <>
              <p>
                Tx1 → Approve:{" "}
                <span>
                  <a
                    href={`${data.url}${data.addressOne}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.addressOne}
                  </a>
                </span>
              </p>
              <p>
                Tx2 → Transfer:{" "}
                <span>
                  {" "}
                  <a
                    href={`${data.url}${data.addressTwo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.addressTwo}
                  </a>
                </span>
              </p>
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
