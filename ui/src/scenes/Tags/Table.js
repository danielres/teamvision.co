import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { withRouter } from "react-router-dom";

import TableResponsive from "../../components/TableResponsive";
import { GET_TAGS } from "./gql";

function TagsTable({ history }) {
  const { loading, error, data } = useQuery(GET_TAGS); // eslint-disable-line no-unused-vars

  if (loading) return <p>Loading...</p>;

  return (
    <TableResponsive
      items={data.tags}
      onRowClick={id => history.push(`/tags/${id}`)}
      rows={{ name: "Name", description: "Description" }}
    />
  );
}

export default withRouter(TagsTable);
