import "./i18n";
import "./styles/app-base.css";
import "react-virtualized/styles.css";
import "./styles/app-components.css";
import "./styles/app-utilities.css";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { ConfigProvider, theme } from "antd";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  split,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import store from "app/store/store";
import { setToken } from "app/store/tokenSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { addAppToTaskBar } from "app/store/appSlice";
import { userLoggedOut } from "app/store/userSlice";

// const client = new ApolloClient({
//   // uri: "http://localhost:9000/graphql",
//   uri: "https://tredumo.com/tredumo_lower_server/graphql",
//   cache: new InMemoryCache(),
// });

const mainUrl = "https://tredumo.com/tredumo_lower_server/graphql";

// HTTP link for queries, mutations, and file uploads
const httpLink = createUploadLink({
  uri: mainUrl,
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: mainUrl.replace("http", "ws"), // Replace "http" with "ws" for WebSocket
    connectionParams: () => {
      const token = store.getState().token.token;
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  })
);

// Middleware to dynamically set headers for HTTP requests
const authLink = setContext((operation, { headers }) => {
  const token = store.getState().token.token;
  return {
    headers: {
      ...headers,
      "x-apollo-operation-name": operation.operationName || "Unknown",
      "apollo-require-preflight": "true",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link to handle token expiration or invalid token errors
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      if (
        extensions?.code === "UNAUTHENTICATED" ||
        extensions?.code === "UNAUTHORIZED"
      ) {
        // Clear the token in your Redux store
        store.dispatch(setToken(null)); // Dispatch an action to clear the token
        store.dispatch(addAppToTaskBar([])); // Close all apps
        store.dispatch(userLoggedOut()); // Remove the user profile

        store.dispatch(
          showMessage({
            message: "Your Session has expired",
            variant: "error",
          })
        );
      }
    });
  }
});

// Split links: use WebSocket for subscriptions and HTTP for everything else
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Use WebSocket for subscriptions
  ApolloLink.from([errorLink, authLink, httpLink]) // Use HTTP for queries/mutations
);

// Apollo Client instance
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <ConfigProvider
      theme={{
        algorithm: [theme.compactAlgorithm],
      }}
    >
      <App />
    </ConfigProvider>
  </ApolloProvider>
);
