import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  overrides: {
    formStyle: {
      formContainer: {
        padding: "40px 26px",
      },
      // input and label
      inputContainer: {
        marginBottom: "30px",
        top: 0,
        left: 0,
        position: "relative",

        "& input, & textarea": {
          height: "50px",
          borderRadius: "6px",
          backgroundColor: "#fff",
          border: "1px solid #C7CBD9",
          padding: "0 15px",
          // lineHeight: "50px",
          fontSize: "16px",
          fontWeight: "500",
          width: "100%",
          color: "black",
          fontFamily: ['"Nunito Sans"', "sans-serif"].join(","),

          "&:active": {
            border: "1.5px solid #7533E2",
            outline: "none",
          },
          "&:focus": {
            border: "1.5px solid #7533E2",
            outline: "none",
          },
          "&:disabled": {
            pointerEvents: "none",
            userSelect: "none",
            backgroundColor: "transparent",
            position: "relative",

            "&~label": {
              color: "gray",
            },
          },
        },

        "& textarea": {
          padding: "15px",
        },
        "& label": {
          fontSize: "14px",
          fontWeight: "700",
          color: "#7533E2",
          marginLeft: "3px",
          marginBottom: "4px",
          display: "block;",

          "& span": {
            color: "#515C72",
            fontSize: "14px",
            fontWeight: "normal",
          },
        },
      },
      label: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#7533E2",
        marginLeft: "3px",
        marginBottom: "4px",
        marginTop: 0,
        display: "block;",
      },
      // nft type checkbox
      nftType: {
        display: "flex",
        padding: "5px",
        backgroundColor: "white",
        border: "1px solid #C7CBD9",
        borderRadius: "6px",
        height: "50px",
        position: "relative",
        cursor: "pointer",
        marginBottom: "30px",

        "& div": {
          width: "calc(50% - 2.5px)",
          // backgroundColor: "red",
          borderRadius: "5px",
          textAlign: "center",
          lineHeight: "40px",
          fontWeight: "600",
          fontSize: "14px",
          position: "relative",
          zIndex: "2",
          color: "#6E798F",
          transition: "0.3s ease",

          "&:first-child": {
            marginRight: "5px",
          },
        },

        // slider
        "&::after": {
          content: "' '",
          height: "40px",
          width: "calc(50% - 7.5px)",
          position: "absolute",
          top: "4px",
          left: "5px",
          zIndex: 1,
          backgroundColor: "#3E3B51",
          borderRadius: "5px",
          transition: "0.3s ease",
        },
      },
      hiddenCheckbox: {
        // checking whether checkbox is checked
        "&:checked + label": {
          // if checked, text colour for erc1155 will be white
          "& div": {
            "&:nth-child(2)": {
              color: "#fff",
              transition: "0.3s ease",
            },
          },
          // moving slider
          "&::after": {
            left: "calc(50% + 2.5px)",
            transition: "0.3s ease",
          },
        },
        // if not checked, text colour for erc721 will be white
        "&:not(:checked) + label": {
          "& div": {
            "&:first-child": {
              color: "#fff",
              transition: "0.3s ease",
            },
          },
        },
      },
      // button
      btnContainer: {
        display: "flex",
        marginTop: "15px",
      },
      btn: {
        height: "44px",
        lineHeight: "44px",
        padding: "0 20px",
        border: "1px solid #8247E5",
        borderRadius: "4px",
        display: "inline-flex",
        textTransform: "capitalize",
        fontWeight: "600",
        fontSize: "16px",
        position: "relative",
        transition: "all 0.3s ease",

        "&:first-child": {
          marginRight: "14px",
        },

        "&:hover": {
          backgroundColor: "#7533e2",
          color: "white",
          borderColor: "#7533e2",
        },

        "&:disabled": {
          backgroundColor: "#bdc3c7",
          borderColor: "#bdc3c7",
          // opacity: 0.65,
          color: "white",
        },
      },
      btnWithLoader: {
        paddingLeft: "44px",
        transition: "all 0.3s ease",
      },
      filled: {
        backgroundColor: "#8247E5",
        color: "white",
      },
      loading: {
        position: "absolute",
        display: "block",
        margin: "auto",
        left: "10px",
        color: "#7533e2",
      },
    },
    modalStyle: {
      btn: {
        height: "44px",
        lineHeight: "44px",
        padding: "0 20px",
        border: "1px solid #8247E5",
        borderRadius: "4px",
        display: "inline-flex",
        textTransform: "capitalize",
        fontWeight: "500",
        fontSize: "16px",
        position: "relative",
        cursor: "pointer",

        "&:first-child": {
          marginRight: "14px",
        },

        "&:hover": {
          backgroundColor: "#7533e2",
          color: "white",
          borderColor: "#7533e2",
        },
      },
      filled: {
        backgroundColor: "#8247E5",
        color: "white",
      },
      modalContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "0 20px",
      },
      modal: {
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        width: "500px",
        color: "#000",
        outline: "none",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow:'hidden',

        "@media (max-width:599px)": {
          width: "100%",
        },
      },
      graphicSection: {
        position: "relative",
        height: "94px",
        backgroundColor: "#E3DEFF",
        borderRadius: "8px",
        marginTop: "40px",

        "& .iconContainer": {
          height: "150px",
          width: "150px",
          position: "absolute",
          top: "-40px",
          left: 0,
          right: 0,
          margin: "auto",
        },

        "& svg": {
          display: "block",
          margin: "auto",
          width: "150px",
        },

        "& img": {
          position: "absolute",
          margin: "44px auto",
          left: 0,
          right: 0,
          display: "block",
          width: "62px",
        },
      },
      textSection: {
        marginTop: "26px",

        "& p": {
          textAlign: "center",
          color: "#6E798F",
          fontWeight: "600",

          "& span": {
            fontWeight: "600",
            display: "block",
            wordBreak: "break-all",

            "& a": {
              color: "inherit",
            },
          },
        },

        "& .credit": {
          display: "flex",
          flexDirection: "column",
          fontSize: "12px",
          marginTop: "40px",
          padding: "0 20px",

          "& span": {
            fontWeight: "normal",

            "&:first-child": {
              marginBottom: "10px",
              fontSize: "14px",
            },
          },
        },
      },

      closeModal: {
        height: "30px",
        width: "30px",
        backgroundColor: "#FFDEDE",
        borderRadius: "15px",
        position: "absolute",
        top: "17px",
        right: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",

        "&:hover": {
          backgroundColor: "#ffc1c1",
        },
      },
    },
    msgStyle: {
      msgContainer: {
        padding: "0 26px",
        marginTop: "30px",
      },
      msg: {
        // backgroundColor: "#FFE8C3",
        backgroundColor: "rgb(255 232 195 / 56%)",
        borderRadius: "6px",
        padding: "20px",
        border: "1px solid #FFE8C3",
      },
      title: {
        fontWeight: "bold",
        color: "#434240",
        margin: 0,
      },
      text: {
        fontSize: "14px",
        marginBottom: "0",
      },
      btn: {
        fontSize: "14px",
        backgroundColor: "#3e3b51",
        color: "white",
        textTransform: "Capitalize",
        padding: "5px 15px",

        "&:hover": {
          backgroundColor: "#000",
        },
      },
      metamaskLogo: {
        width: 30,
        marginRight: 5,
      },
    },
    mui: {
      container: {
        maxWidth: "1080px",
        margin: "auto",
        padding: "0",
        ["@media (max-width:1120px)"]: {
          padding: "0 20px",
        },
        ["@media (max-width:599px)"]: {
          padding: "0 15px",
        },
      },
    },
  },
  typography: {
    fontFamily: ['"Nunito Sans"', "sans-serif"].join(","),

    h1: {
      fontWeight: 400,
      fontSize: "2.5rem",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
  },
  palette: {
    primary: {
      main: "#7167D9",
    },
  },
});

export default theme;
