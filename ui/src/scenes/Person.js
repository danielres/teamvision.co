import { useQuery } from "@apollo/react-hooks";
import classnames from "classnames";
import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import Autosuggest from "../components/forms/TagAutoSuggest";
import { GET_PERSON_WITH_TAGGINGS } from "../gql/persons";

const Level = ({ level }) => {
  return level
    ? Array.from({ length: level })
        .map(() => "▮")
        .join("")
        .padEnd(5, "▯")
    : "—";
};

const TaggingsTable = ({ personId, taggings, colorClass = "" }) => (
  <div className="table w-full">
    {taggings.map(t => (
      <div key={t.tag.name} className="table-row">
        <div className="table-cell w-32">
          <Link to={`/persons/${personId}/${t.tag.name}`}>{t.tag.name}</Link>
        </div>
        <div
          className={classnames(
            "table-cell w-16 md:text-right",
            t.level ? colorClass : "text-gray-500"
          )}
        >
          <Level level={t.level} />
        </div>
        <div className="table-cell text-sm pl-4 md:pl-12">
          <div className="truncate w-64 text-gray-600">{t.description}</div>
        </div>
      </div>
    ))}
  </div>
);

const Person = ({ match, location, history }) => {
  const { id: personId } = match.params;
  const { loading, error, data } = useQuery(GET_PERSON_WITH_TAGGINGS, {
    variables: { id: personId }
  });

  if (loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const motivations = data.person.taggings.filter(t => t.on === "motivations");
  const skills = data.person.taggings.filter(t => t.on === "skills");

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
        <TaggingsTable
          colorClass="text-pink-600"
          personId={personId}
          taggings={motivations}
        />

        <div className="w-32 py-2">
          <Autosuggest on="motivations" type="Person" id={personId} />
        </div>
      </div>
      <div className="card">
        <h3 className="mb-4 text-lg">Skills</h3>
        <TaggingsTable
          colorClass="text-blue-600"
          personId={personId}
          taggings={skills}
        />

        <div className="w-32 py-2">
          <Autosuggest on="skills" type="Person" id={personId} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(Person);
