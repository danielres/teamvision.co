import React from "react";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import { useQuery } from "@apollo/react-hooks";

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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <section>
      <h2>User profile</h2>
      <pre>{JSON.stringify(data.userInfo, null, 2)}</pre>
    </section>
  );
}
