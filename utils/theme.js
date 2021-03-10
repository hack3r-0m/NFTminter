import { red, amber, grey } from "@material-ui/core/colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const fontFamilyRoboto = {
  fontFamily: [
    "Roboto",
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(",")
};

const fontFamilyMetropolis = {
  fontFamily: [
    "Metropolis",
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(","),
  letterSpacing: "0.015rem"
};

// A custom theme for this app
const lightMuiTheme = createMuiTheme({
  type: "light",
  palette: {
    primary: {
      main: "#FFF"
    },
    secondary: {
      main: amber[500],
      light: "#feefc3"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#FFF",
      highlight: "#F1F3F4"
    }
  },
  custom: {
    fontFamily: {
      roboto: fontFamilyRoboto,
      metropolis: fontFamilyMetropolis
    },
    palette: {
      iconColor: "#5f6368",
      btn: "#cceabb"
    }
  }
});

const darkMuiTheme = createMuiTheme({
  type: "dark",
  palette: {
    primary: {
      main: "#33313b"
    },
    secondary: {
      main: amber[500],
      light: "#41331C"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#33313b",
      highlight: "#535456"
    },
    text: {
      primary: "#E8EAED",
      secondary: "#FFFFFFDE"
    }
  },
  custom: {
    fontFamily: {
      roboto: fontFamilyRoboto,
      metropolis: fontFamilyMetropolis
    },
    palette: {
      iconColor: "#949596",
      btn: "#4592af"
    }
  }
});

export const lightTheme = responsiveFontSizes(lightMuiTheme);
export const darkTheme = responsiveFontSizes(darkMuiTheme);