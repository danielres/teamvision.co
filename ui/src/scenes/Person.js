import { useQuery } from "@apollo/react-hooks";
import classnames from "classnames";
import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import Autosuggest from "../components/forms/TagAutoSuggest";
import Level from "../components/taggings/Level";
import { GET_PERSON_WITH_TAGGINGS } from "../gql/persons";
import { formatRelative } from "date-fns";

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
          <Level tagging={t} />
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
  const { loading, error, data, refetch } = useQuery(GET_PERSON_WITH_TAGGINGS, {
    variables: { id: personId }
  });

  if (!data.person && loading) return <p className="card">Loading...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const motivations = data.person.taggings.filter(t => t.on === "motivations");
  const skills = data.person.taggings.filter(t => t.on === "skills");
  const now = new Date();

  return (
    <div>
      <section className="w-full card flex">
        <div>
          <div className="w-24 h-24 md:w-48 md:h-48">
            <Avatar size="full" src={data.person.picture} />
          </div>
        </div>

        <div className="w-full ml-8 md:pl-4">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl">{data.person.name}</h2>
            <div className="text-gray-700">{data.person.headline}</div>
          </div>

          <div className="items-baseline text-sm md:text-base">
            <div className="flex">
              <div className="w-32 text-gray-700">Current position</div>
              <div className="text-black">{data.person.currentPosition}</div>
            </div>
            <div className="flex">
              <div className="w-32 text-gray-700">Email</div>
              <div className="text-black">{data.person.email}</div>
            </div>
            <div className="flex">
              <div className="w-32 text-gray-700">Added</div>
              <div className="text-black">
                {formatRelative(new Date(data.person.createdAt), now)}
              </div>
            </div>
          </div>
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
          <Autosuggest
            onSuccess={refetch}
            on="motivations"
            type="Person"
            id={personId}
          />
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
          <Autosuggest
            onSuccess={refetch}
            on="skills"
            type="Person"
            id={personId}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(Person);
