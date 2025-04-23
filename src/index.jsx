import "./i18n";
import "./styles/app-base.css";
import "react-virtualized/styles.css";
import "./styles/app-components.css";
import "./styles/app-utilities.css";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { ConfigProvider, theme } from "antd";



const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);
root.render(
  // <ApolloProvider client={client}>
  <ConfigProvider
    theme={
      {
        // algorithm: [theme.compactAlgorithm],
      }
    }
  >
    <App />
  </ConfigProvider>
  // </ApolloProvider>
);
