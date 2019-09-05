import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Form from "./Form";
import PersonsTable from "./Table";

function Persons({ history }) {
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
        <PersonsTable />
      </section>
    </>
  );
}

export default withRouter(Persons);
