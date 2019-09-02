import React from "react";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import { useQuery } from "@apollo/react-hooks";

export default function Persons() {
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

  if (loading) return <p>Loading persons...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <section className="card">
      <h2>Persons</h2>
      <ul>
        {data.persons.map(({ email, name }) => (
          <li key={email}>
            <p>
              {email} <small> -- {name}</small>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
