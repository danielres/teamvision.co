import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import React from "react";
import { withRouter } from "react-router";
import Branch from "./Tags/Branch";

const Tag = ({ match, location, history }) => {
  const { id } = match.params;
  const { loading, error, data } = useQuery(
    gql/* GraphQL */ `
      query($name: String!) {
        tag(name: $name) {
          description
          name
        }
      }
    `,
    { variables: { name: id } }
  );

  if (loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="flex">
      <section className="w-64 card mr-4 hidden sm:block">
        <Branch node={data.tag.name} />
      </section>

      <section className="w-full card ">
        <table className="spaced w-full">
          <tbody>
            <tr className="mb-6">
              <th className="">Name</th>
              <td className="">{data.tag.name}</td>
            </tr>
            <tr className="mb-6">
              <th className="">Description</th>
              <td className="">{data.tag.description}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default withRouter(Tag);
