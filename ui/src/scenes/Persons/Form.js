import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import flatten from "lodash/flatten";
import get from "lodash/get";

import { CREATE_PERSON, GET_PERSONS } from "./gql";

export default function CreatePerson({ ButtonDone }) {
  const initialValues = { email: "", name: "" };
  const [values, setValues] = useState(initialValues);
  const resetValues = () => setValues(initialValues);

  const [createPerson, response] = useMutation(CREATE_PERSON, {
    update: (cache, { data: { createPerson } }) => {
      const { persons } = cache.readQuery({ query: GET_PERSONS });
      cache.writeQuery({
        query: GET_PERSONS,
        data: { persons: [createPerson, ...persons] }
      });
    }
  });

  const submit = e => {
    e.preventDefault();
    createPerson({ variables: values }).then(resetValues);
  };

  const errors = get(response, "error.graphQLErrors", []);
  const validationErrors = flatten(
    errors.map(e => get(e, "extensions.exception.errors", []))
  );

  return (
    <div>
      {!!errors.length && (
        <ul className="alert mb-4 p-4 list-inside">
          {validationErrors.length
            ? validationErrors.map(e => <li className="list-disc">{e}</li>)
            : errors.map(e => <li>{e.message}</li>)}
        </ul>
      )}

      <form onSubmit={submit}>
        <input
          className="formInput mb-4"
          placeholder="Email"
          value={values.email}
          onChange={e => setValues({ ...values, email: e.target.value })}
        />

        <input
          className="formInput mb-4"
          placeholder="Name"
          value={values.name}
          onChange={e => setValues({ ...values, name: e.target.value })}
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
