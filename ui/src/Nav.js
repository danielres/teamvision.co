import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import React from "react";
import { Link } from "react-router-dom";

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
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/persons">Persons</Link>
        </li>
      </ul>

      <ul>
        <li>
          <Link to="/profile">{data.userInfo.email}</Link>
          <img
            alt="User portrait"
            src={data.userInfo.picture}
            height="50"
            width="50"
          />
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}
