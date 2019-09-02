import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PERSON, GET_PERSONS } from "./gql";

export default function CreatePerson({ ButtonDone }) {
  let nameInput;
  let emailInput;

  const [createPerson, response] = useMutation(CREATE_PERSON, {
    update: (cache, { data: { createPerson } }) => {
      const { persons } = cache.readQuery({ query: GET_PERSONS });
      cache.writeQuery({
        query: GET_PERSONS,
        data: { persons: [createPerson, ...persons] }
      });
    }
  });

  return (
    <div>
      {response.error && (
        <ul>
          {response.error.graphQLErrors &&
            response.error.graphQLErrors.map(e => <li>{e.message}</li>)}
        </ul>
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          createPerson({
            variables: {
              email: emailInput.value,
              name: nameInput.value
            }
          });
          emailInput.value = "";
          nameInput.value = "";
        }}
      >
        <input
          className="formInput mb-4"
          placeholder="Email"
          ref={node => (emailInput = node)}
        />

        <input
          className="formInput mb-4"
          placeholder="Name"
          ref={node => (nameInput = node)}
        />

        <div className="justify-between flex">
          <button className="formButton" type="submit">
            Add person
          </button>

          <ButtonDone />
        </div>
      </form>
    </div>
  );
}
