import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";

export default ({ children }) => (
  <ApolloProvider>
    <Router>{children}</Router>
  </ApolloProvider>
);
