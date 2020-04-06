import { ApolloProvider } from "@apollo/react-hooks";
import React from "react";
import { client } from "./client";

const Wrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default Wrapper;
