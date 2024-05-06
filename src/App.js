import { CacheProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { useLocation, useRoutes } from "react-router-dom";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./i18n";
import routes from "./routes";
import createTheme from "./theme";

import { getRouteName } from "./functions";
import useTheme from "./hooks/useTheme";
import { store } from "./redux/store";
import createEmotionCache from "./utils/createEmotionCache";

import { useLazyQuery } from "@apollo/client";
import { QUERY_SEO } from "./seoApollo";

const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
  const content = useRoutes(routes);
  const location = useLocation();
  const { theme } = useTheme();
  const [SEOData, setSEOData] = useState([]);
  const [title, setTitle] = useState("");
  const currentURL = location.pathname;
  const routeName = getRouteName(currentURL);

  const [getSEO] = useLazyQuery(QUERY_SEO);

  const handleQuerySEO = async () => {
    let result = await getSEO({
      variables: {
        where: {
          title: routeName,
        },
      },
    });
    if (result?.data?.getPublicSEO?.data) {
      setSEOData(result?.data?.getPublicSEO?.data);
      setTitle(result?.data?.getPublicSEO?.data?.[0]?.title);
    }
  };

  const formattedData = SEOData?.map((item) => {
    return Object.entries(item).map(([key, value]) => {
      return {
        name: key,
        content: value,
      };
    });
  }).flat();

  useEffect(() => {
    handleQuerySEO();
  }, [routeName]);

  return (
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet defaultTitle={title} meta={formattedData} />
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiThemeProvider theme={createTheme(theme)}>
              {/* folder context provider for controlling nested folder ids though localStorage */}
              {content}
            </MuiThemeProvider>
          </LocalizationProvider>
        </Provider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default App;
