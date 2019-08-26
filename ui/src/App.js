import React from "react";
import { useQuery } from "@apollo/react-hooks";

import logo from "./logo.svg";
import "./App.css";

import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead

function Books() {
  const { loading, error, data } = useQuery(
    gql`
      {
        books {
          author
          title
        }
      }
    `
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.books.map(({ author, title }) => (
        <li key={title}>
          <p>
            {title} <small> -- {author}</small>
          </p>
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <div className="App">
      <Books></Books>
    </div>
  );
}

export default App;
