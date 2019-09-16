import { useQuery } from "@apollo/react-hooks";
import classnames from "classnames";
import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Level from "../components/taggings/Level";
import { GET_PERSON_WITH_TAGGINGS } from "../gql/persons";

const Tagging = ({ tagging, title, colorClass }) => (
  <>
    <div className="flex mb-4">
      <h3 className="text-lg text-gray-700">{title}</h3>
      <div
        className={classnames(
          "inline-block ml-4",
          tagging && tagging.level ? colorClass : "text-gray-600"
        )}
      >
        <Level tagging={tagging} />
      </div>
    </div>

    <div>
      {tagging && tagging.description ? (
        tagging.description
      ) : (
        <span className="text-gray-500">+ Add a description</span>
      )}
    </div>
  </>
);

const PersonTag = ({ match, location, history }) => {
  const { id: personId, tag: tagName } = match.params;
  const { loading, error, data } = useQuery(GET_PERSON_WITH_TAGGINGS, {
    variables: { id: personId }
  });

  if (loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const motivations = data.person.taggings.filter(t => t.on === "motivations");
  const skills = data.person.taggings.filter(t => t.on === "skills");
  const motivation = motivations.filter(t => t.tag.name === tagName)[0];
  const skill = skills.filter(t => t.tag.name === tagName)[0];

  return (
    <div>
      <section className="card">
        <h2 className="text-xl">
          <Link to={`/persons/${personId}`}>{data.person.name}</Link>
          <div className="inline-block text-gray-600 w-8 text-center">:</div>
          <Link to={`/tags/${tagName}`}>{tagName}</Link>
        </h2>
      </section>

      <section className="card">
        <div className="mb-8 pb-8 border-gray-300 border-b">
          <Tagging
            title="Motivation"
            tagging={motivation}
            colorClass="text-pink-500"
          />
        </div>

        <div className="">
          <Tagging title="Skill" tagging={skill} colorClass="text-blue-500" />
        </div>
      </section>
    </div>
  );
};

export default withRouter(PersonTag);
