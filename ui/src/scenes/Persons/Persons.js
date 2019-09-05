import { useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import TableResponsive from "../../components/TableResponsive";
import Form from "./Form";
import { GET_PERSONS } from "./gql";

function Persons({ history }) {
  const { loading, error, data } = useQuery(GET_PERSONS); // eslint-disable-line no-unused-vars
  const [isFormvisible, setIsFormVisible] = useState(false);

  const closeForm = () => setIsFormVisible(false);
  const openForm = () => setIsFormVisible(true);

  const ButtonDone = () => (
    <button className="btn" onClick={closeForm}>
      Done
    </button>
  );

  return (
    <>
      {isFormvisible ? (
        <section className="card">
          <Form ButtonDone={ButtonDone} />
        </section>
      ) : (
        <div className="text-right">
          <button
            className="btn bg-white mb-4 shadow mr-6 md:mr-0"
            onClick={openForm}
          >
            Add person
          </button>
        </div>
      )}

      <section className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableResponsive
            items={data.persons}
            onRowClick={id => history.push(`/persons/${id}`)}
            rows={{ name: "Name", email: "Email" }}
          />
        )}
      </section>
    </>
  );
}

export default withRouter(Persons);
