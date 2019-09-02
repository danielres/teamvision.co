import React from "react";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import { useQuery } from "@apollo/react-hooks";

import Avatar from "../components/Avatar";

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
      <Avatar src={data.userInfo.picture} />

      <div className="bg-gray-100 my-4 p-4">
        {Object.entries(data.userInfo).map(([k, v]) => (
          <div>
            {k}: {`${v}`}
          </div>
        ))}
      </div>
    </section>
  );
}
