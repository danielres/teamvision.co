import React from "react";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import { useQuery } from "@apollo/react-hooks";

import { useAuth } from "./auth";

export default function() {
  const { logout } = useAuth();

  const { loading, error, data } = useQuery(
    gql`
      {
        userInfo {
          email
          email_verified
          picture
        }
      }
    `
  );

  if (error) return <pre>{JSON.stringify(error)}</pre>;
  if (loading) return null;

  return (
    <div>
      {data.userInfo.email}

      <img
        alt="User portrait"
        src={data.userInfo.picture}
        height="50"
        width="50"
      />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
