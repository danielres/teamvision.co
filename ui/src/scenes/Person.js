import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import React from "react";
import { withRouter } from "react-router";

import Avatar from "../components/Avatar";
import PersonsTable from "./Persons/Table";

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
    <div className="flex">
      <section className="w-64 card mr-4 hidden sm:block">
        <PersonsTable />
      </section>

      <section className="w-full card flex">
        <div>
          <div className="w-24 h-24 md:w-48 md:h-48">
            <Avatar size="full" src={data.person.picture} />
          </div>
        </div>

        <table className="spaced w-full ml-12">
          <tbody>
            <tr className="mb-6">
              <th className="">Name</th>
              <td className="">{data.person.name}</td>
            </tr>
            <tr className="mb-6">
              <th className="">Email</th>
              <td className="">{data.person.email}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default withRouter(Person);
