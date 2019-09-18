import { useMutation, useQuery } from "@apollo/react-hooks";
import classnames from "classnames";
import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Level from "../components/taggings/Level";
import { GET_PERSON_WITH_TAGGINGS } from "../gql/persons";
import { SET_TAG_ON } from "../gql/tags";

const Tagging = ({ tagging, title, colorClass }) => (
  <>
    <div className="flex mb-4">
      <h3 className="text-lg text-gray-700">{title}</h3>
      <div className={classnames("inline-block ml-4")}>
        <Level tagging={tagging} colorClass={colorClass} />
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
  const { loading, error, data, refetch } = useQuery(GET_PERSON_WITH_TAGGINGS, {
    variables: { id: personId }
  });

  // eslint-disable-next-line no-unused-vars
  const [setTagOn, setTagOnResponse] = useMutation(SET_TAG_ON);

  if (loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const motivations = data.person.taggings.filter(t => t.on === "motivations");
  const skills = data.person.taggings.filter(t => t.on === "skills");
  const motivation = motivations.filter(t => t.tag.name === tagName)[0];
  const skill = skills.filter(t => t.tag.name === tagName)[0];

  const addOn = on =>
    setTagOn({
      variables: {
        on,
        tagName,
        targetId: personId,
        targetType: "Person"
      }
    }).then(refetch);

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
        {motivation && (
          <Tagging
            title="Motivation level:"
            tagging={motivation}
            colorClass="text-pink-500"
          />
        )}

        {skill && motivation && (
          <div className="my-8 border-gray-300 border-b" />
        )}

        {skill && (
          <Tagging
            title="Skill level:"
            tagging={skill}
            colorClass="text-blue-500"
          />
        )}
      </section>

      <div className="text-right mb-4 mr-6 md:mr-0">
        {!skill && (
          <button
            onClick={() => addOn("skills")}
            className="btn-transparent rounded bg-white shadow"
          >
            + Add <b className="text-blue-500">{tagName}</b> to{" "}
            {data.person.name} skills
          </button>
        )}
        {!motivation && (
          <button
            onClick={() => addOn("motivations")}
            className="btn-transparent rounded bg-white shadow"
          >
            + Add <b className="text-pink-500">{tagName}</b> to{" "}
            {data.person.name} motivations
          </button>
        )}
      </div>
    </div>
  );
};

export default withRouter(PersonTag);
