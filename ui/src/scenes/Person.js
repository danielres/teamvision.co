import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import React from "react";
import { withRouter } from "react-router";

import Avatar from "../components/Avatar";

const Person = ({ match, location, history }) => {
  const { id } = match.params;
  const { loading, error, data } = useQuery(
    gql/* GraphQL */ `
      query($id: ID) {
        person(id: $id) {
          email
          name
        }
      }
    `,
    { variables: { id } }
  );

  if (loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <section className="card">
      <Avatar src={data.person.picture} />
      {["name", "email"].map(k => (
        <div>
          {k}: {data.person[k]}
        </div>
      ))}
    </section>
  );
};

export default withRouter(Person);
