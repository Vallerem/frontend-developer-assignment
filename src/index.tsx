import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";

import "./index.css";
import App from "./components/App";

const { Accordion, Button, Card, Divider, Form, FormLabel, FormError, Input } =
  chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Accordion,
    Button,
    Card,
    Divider,
    Form,
    FormLabel,
    FormError,
    Input,
  },
});

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <App />
    </ChakraBaseProvider>
  </React.StrictMode>
);
