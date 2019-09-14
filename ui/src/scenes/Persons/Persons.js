import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Form from "./Form";
import PersonsTable from "./Table";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import { useQuery } from "@apollo/react-hooks";

import { GET_PERSONS } from "./gql";

function Persons({ history }) {
  const [isFormvisible, setIsFormVisible] = useState(false);
  const [isPrefilledFormVisible, setIsPrefilledFormVisible] = useState(false);

  const {
    loading: userInfo_loading,
    error: userInfo_error, // eslint-disable-line no-unused-vars
    data: { userInfo }
  } = useQuery(
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

  const {
    loading: persons_loading,
    error: persons_error, // eslint-disable-line no-unused-vars
    data: { persons }
  } = useQuery(GET_PERSONS); // eslint-disable-line no-unused-vars

  if (persons_loading || userInfo_loading) return <p>Loading...</p>;

  const isUserInPersons = persons.map(p => p.email).includes(userInfo.email);

  const closeForms = () => {
    setIsFormVisible(false);
    setIsPrefilledFormVisible(false);
  };
  const openForm = () => setIsFormVisible(true);
  const openPrefilledForm = () => setIsPrefilledFormVisible(true);

  const ButtonDone = () => (
    <button className="btn" onClick={closeForms}>
      Done
    </button>
  );

  return (
    <>
      {isFormvisible ? (
        <section className="card">
          <Form ButtonDone={ButtonDone} />
        </section>
      ) : isPrefilledFormVisible ? (
        <section className="card">
          <Form ButtonDone={ButtonDone} initialValues={userInfo} />
        </section>
      ) : (
        <div className="text-right">
          {!isUserInPersons && (
            <button
              title="Add me to the listed persons"
              className="btn bg-white mb-4 shadow mr-4"
              onClick={openPrefilledForm}
            >
              Add me
            </button>
          )}
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
