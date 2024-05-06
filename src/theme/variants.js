import merge from "deepmerge";
import { green, grey, indigo, red, blue } from "@mui/material/colors";
import { THEMES } from "../constants";

const customBlue = {
  50: "#e9f0fb",
  100: "#c8daf4",
  200: "#a3c1ed",
  300: "#7ea8e5",
  400: "#6395e0",
  500: "#4782da",
  600: "#407ad6",
  700: "#17766B",
  800: "#2f65cb",
  900: "#2052c2 ",
};

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    mode: "light",
    primary: {
      main: "#17766B",
      contrastText: "#FFF",
    },
    main: "rgba(0, 0, 0, 0.4)",
    secondary: {
      main: customBlue[500],
      contrastText: "#FFF",
    },
    background: {
      default: "#F7F9FC",
      paper: "#FFF",
    },

    // new custom
    primaryTheme: {
      main: "#17766B",
      brown: (alpha = 1) => `rgb(75, 70, 92, ${alpha})`,
      contrastText: "#FFF",
    },
    error: {
      main: "#EA5455",
      contrastText: "#FFF",
    },
    secondaryTheme: {
      main: "#E8E8E8",
      contrastText: "#A5A2AD",
    },
    greyTheme: {
      main: "#E8E8E8",
      contrastText: "#A5A2AD",
    },
    white: {
      main: "#FFFFFF",
    },
    green: {
      main: "#28C76F",
    },
    grey: {
      main: "#A8AAAE",
    },
    red: {
      main: "#EA5455",
    },
    orangeTheme: {
      main: "#FF9F43",
    },
    blueTheme: {
      main: "#00CFE8",
    },
    customeText: {
      main: "#4B465C",
    },
    defaultText: {
      main: "#4B465C",
    },
  },

  header: {
    color: "rgba(0, 0, 0, 0.7)",
    background: "#FFFFFF",
    search: {
      color: grey[800],
    },
    indicator: {
      background: customBlue[600],
    },
  },
  footer: {
    color: "rgba(0, 0, 0, 0.7)",
    background: "#FFFFFF",
  },
  sidebar: {
    color: "rgba(0, 0, 0, 0.7)",
    background: "#FFFFFF",
    header: {
      color: "rgba(0, 0, 0, 0.7)",
      background: "#FFFFFF",
      brand: {
        color: customBlue[500],
      },
    },
    footer: {
      color: "rgba(0, 0, 0, 0.7)",
      background: "#FFFFFF",
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "rgba(0, 0, 0, 0.7)",
      background: "#FFFFFF",
    },
  },
};

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  palette: {
    mode: "dark",
    primary: {
      main: "#1B2635",
      contrastText: "#FFF",
    },
    breadcrumb: {
      main: "#FFF",
    },
    background: {
      default: "#1B2635",
      paper: "#233044",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(255, 255, 255, 0.5)",
    },
  },
  header: {
    color: grey[300],
    background: "#1B2635",
    search: {
      color: grey[200],
    },
  },
  footer: {
    color: grey[300],
    background: "#233044",
  },
});

const lightVariant = merge(defaultVariant, {
  name: THEMES.LIGHT,
  palette: {
    mode: "light",
  },
  header: {
    color: grey[200],
    background: "#FFF",
    search: {
      color: grey[100],
    },
    indicator: {
      background: red[700],
    },
  },
  sidebar: {
    color: grey[900],
    background: "#FFF",
    header: {
      color: "#FFF",
      background: "#FFFFFF",
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: grey[800],
      background: "#F7F7F7",
      online: {
        background: green[500],
      },
    },
  },
});

const blueVariant = merge(defaultVariant, {
  name: THEMES.BLUE,
  palette: {
    mode: "light",
    primary: {
      main: blue[700],
    },
  },
  header: {
    color: grey[200],
    background: blue[700],
    search: {
      color: grey[100],
    },
    indicator: {
      background: red[700],
    },
  },
  sidebar: {
    color: "#FFF",
    background: blue[600],
    header: {
      color: "#FFF",
      background: blue[700],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: blue[600],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const greenVariant = merge(defaultVariant, {
  name: THEMES.GREEN,
  palette: {
    primary: {
      main: green[800],
      contrastText: "#FFF",
    },
    secondary: {
      main: green[500],
      contrastText: "#FFF",
    },
  },
  header: {
    indicator: {
      background: green[600],
    },
  },
  sidebar: {
    color: "#FFF",
    background: green[700],
    header: {
      color: "#FFF",
      background: green[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: green[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const indigoVariant = merge(defaultVariant, {
  name: THEMES.INDIGO,
  palette: {
    primary: {
      main: indigo[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: indigo[400],
      contrastText: "#FFF",
    },
  },
  header: {
    indicator: {
      background: indigo[600],
    },
  },
  sidebar: {
    color: "#FFF",
    background: indigo[700],
    header: {
      color: "#FFF",
      background: indigo[800],
      brand: {
        color: "#FFFFFF",
      },
    },
    footer: {
      color: "#FFF",
      background: indigo[800],
      online: {
        background: "#FFF",
      },
    },
    badge: {
      color: "#000",
      background: "#FFF",
    },
  },
});

const variants = [
  defaultVariant,
  darkVariant,
  lightVariant,
  blueVariant,
  greenVariant,
  indigoVariant,
];

export default variants;
