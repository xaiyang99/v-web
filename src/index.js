import "animate.css/animate.min.css";
import "chart.js/auto";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import reportWebVitals from "./utils/reportWebVitals";
// apollo client
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Provider } from "react-redux";
import { accessTokenLocalKey } from "./functions";
import { store } from "./redux/store";

const api = "http://localhost:4000/graphql";
// const api = process.env.REACT_APP_API_URL;

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem("accessToken");
  const token = localStorage.getItem(accessTokenLocalKey);

  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

/* const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (let i = 0; i < graphQLErrors.length; i++) {
      const error = graphQLErrors[i];
      const message = handleGraphqlErrors(error.message);
      if (message) {
        errorMessage(message, 3000);
      }
    }
  }

  if (networkError) {
    for (let i = 0; i < networkError.length; i++) {
      const error = networkError[i];
      const message = handleGraphqlErrors(error.message);
      if (message) {
        errorMessage(message, 3000);
      }
    }
  }
}); */

const client = new ApolloClient({
  link: from([
    authLink.concat(
      createHttpLink({
        uri: api,
      }),
    ),
  ]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  connectToDevTools: false,
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  </BrowserRouter>,
);

reportWebVitals();
