import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import jsconfigPaths from "vite-jsconfig-paths";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";
import linaria from "@linaria/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    jsconfigPaths({
      parseNative: false,
    }),
    svgrPlugin(),
    linaria(),
    {
      name: "custom-hmr-control",
      handleHotUpdate({ file, server }) {
        if (file.includes("src/app/configs/")) {
          server.ws.send({
            type: "full-reload",
          });
          return [];
        }
        return;
      },
    },
  ],
  build: {
    outDir: "dist",
  },
  server: {
    open: true,
    port: 3000,
  },
  define: {
    global: "window",
  },
  resolve: {
    alias: {
      "@": "/src",
      "@fuse": "/src/@fuse",
      "@history": "/src/@history",
      "@lodash": "/src/@lodash",
      "@mock-api": "/src/@mock-api",
      "@schema": "/src/@schema",
      "app/store": "/src/app/store",
      "app/shared-components": "/src/app/shared-components",
      "app/configs": "/src/app/configs",
      "app/theme-layouts": "/src/app/theme-layouts",
      "app/AppContext": "/src/app/AppContext",
      "react/jsx-runtime.js": "react/jsx-runtime",
    },
  },
  optimizeDeps: {
    include: [
      "@mui/icons-material",
      "@mui/material",
      "@mui/base",
      "@mui/styles",
      "@mui/system",
      "@mui/utils",
      "@emotion/cache",
      "@emotion/react",
      "@emotion/styled",
      "lodash",
    ],
    exclude: [],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
      plugins: [fixReactVirtualized],
    },
  },
});
