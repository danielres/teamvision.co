import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead

function Persons() {
  const { loading, error, data } = useQuery(
    gql`
      {
        persons {
          email
          name
        }
      }
    `
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.persons.map(({ email, name }) => (
        <li key={email}>
          <p>
            {email} <small> -- {name}</small>
          </p>
        </li>
      ))}
    </ul>
  );
}

function App() {
  return <Persons />;
}

export default App;
