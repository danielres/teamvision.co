import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import classnames from "classnames";
import React from "react";
import { withRouter } from "react-router";
import Avatar from "../components/Avatar";
import Autosuggest from "../components/forms/TagAutoSuggest";

const skills = [
  {
    name: "React",
    level: 5,
    description:
      "I have worked intensively with React during the last few years and gained extensive experience of React and its ecosystem."
  },
  {
    name: "Neo4j",
    level: 2,
    description: ""
  }
];

const motivations = [
  {
    name: "React",
    level: 4,
    description: ""
  },
  {
    name: "Neo4j",
    level: 5,
    description: "I'd love to gain experience in Graph databases."
  }
];

const TagsTable = ({ tags, colorClass = "" }) => (
  <div className="table w-full">
    {tags.map(t => (
      <div key={t.name} className="table-row">
        <div className="table-cell w-32">{t.name}</div>
        <div className={classnames("table-cell w-16", colorClass)}>
          {Array.from({ length: t.level })
            .map(() => "▮")
            .join("")
            .padEnd(5, "▯")}
        </div>
        <div className="table-cell text-sm md:pl-12">
          <div className="truncate w-64 text-gray-600">{t.description}</div>
        </div>
      </div>
    ))}
  </div>
);
const Person = ({ match, location, history }) => {
  const { id: personId } = match.params;
  const { loading, error, data } = useQuery(
    gql/* GraphQL */ `
      query($id: ID) {
        person(id: $id) {
          email
          name
        }
      }
    `,
    { variables: { id: personId } }
  );

  if (loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div>
      <section className="w-full card flex">
        <div>
          <div className="w-24 h-24 md:w-48 md:h-48">
            <Avatar size="full" src={data.person.picture} />
          </div>
        </div>

        <div className="w-full ml-4 md:ml-8">
          <table className="spaced">
            <tbody>
              <tr>
                <th className="">Name</th>
                <td className="">{data.person.name}</td>
              </tr>
              <tr>
                <th className="">Email</th>
                <td className="">{data.person.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="card">
        <h3 className="mb-4 text-lg">Motivations</h3>
        <TagsTable tags={motivations} colorClass="text-pink-600" />

        <div className="w-32 py-2">
          <Autosuggest on="motivations" type="Person" id={personId} />
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg">Skills</h3>
        <TagsTable tags={skills} colorClass="text-blue-600" />

        <div className="w-32 py-2">
          <Autosuggest on="skills" type="Person" id={personId} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(Person);
