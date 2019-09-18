import React from "react";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import { useQuery } from "@apollo/react-hooks";
import truncate from "lodash/truncate";
import Avatar from "../components/Avatar";
import { upperFirst } from "../utils/strings";

export default function() {
  const { loading, error, data } = useQuery(
    gql`
      {
        userInfo {
          email
          email_verified
          picture
          given_name
          family_name
          name
          locale
          updated_at
        }
      }
    `
  );

  if (loading) return <p className="card">Loading profile...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <section className="card">
      <div className="flex">
        <div className="w-64 mr-6 pr-6">
          <Avatar src={data.userInfo.picture} />
        </div>

        <div className="mb-4 w-full">
          <h2 className="text-lg ">Authentication data (Private)</h2>
          <div className="bg-gray-100 p-4 border rounded text-gray-700 ">
            {Object.entries(data.userInfo)
              .filter(([k, v]) => !k.startsWith("__"))
              .map(([k, v]) => (
                <div className="flex mb-1" key={k}>
                  <div className="w-64">{upperFirst(k.replace("_", " "))}</div>
                  <div>
                    {String(v).startsWith("http") ? (
                      <a href={v} title={v} target="__blank">
                        {truncate(v, { length: 60, separator: "&hellip;" })}
                      </a>
                    ) : (
                      truncate(v, { length: 60, separator: "&hellip;" })
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
