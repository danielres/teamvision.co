import ApolloClient from "apollo-boost";
import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import { useAuth0 } from "../auth0";

const { REACT_APP_GRAPHQL_URL } = process.env;

const makeClient = token =>
  new ApolloClient({
    uri: REACT_APP_GRAPHQL_URL,
    request: async operation => {
      operation.setContext({
        headers: {
          authorization: token ? `${token}` : ""
        }
      });
    }
  });

export default function ApolloProviderWithAuth({ children }) {
  const { isAuthenticated, getTokenSilently } = useAuth0();
  const [client, setClient] = useState(makeClient());

  useEffect(() => {
    isAuthenticated &&
      getTokenSilently().then(token => setClient(makeClient(token)));
  }, [getTokenSilently, isAuthenticated]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
