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
    <div>
      <div className="mb-4 text-right mr-6 md:mr-0">
        <button
          title="Add to my motivations"
          className="bg-white hover:text-white hover:bg-pink-500 btn-transparent mr-4"
        >
          <b>+</b> Motivations
        </button>
        <button
          title="Add to my skills"
          className="bg-white hover:text-white hover:bg-blue-500 btn-transparent"
        >
          <b>+</b> Skills
        </button>
      </div>

      <div className="flex">
        <section
          className="card mr-4 hidden sm:block"
          style={{ whiteSpace: "nowrap" }}
        >
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
    </div>
  );
};

export default withRouter(Tag);
