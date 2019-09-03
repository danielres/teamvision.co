import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import flatten from "lodash/flatten";
import get from "lodash/get";

import { CREATE_TAG, GET_TAGS } from "./gql";

export default function CreateTag({ ButtonDone }) {
  const initialValues = { description: "", name: "" };
  const [values, setValues] = useState(initialValues);
  const resetValues = () => setValues(initialValues);

  const [createTag, response] = useMutation(CREATE_TAG, {
    update: (cache, { data: { createTag } }) => {
      const { tags } = cache.readQuery({ query: GET_TAGS });
      cache.writeQuery({
        query: GET_TAGS,
        data: { tags: [createTag, ...tags] }
      });
    }
  });

  const submit = e => {
    e.preventDefault();
    createTag({ variables: values }).then(resetValues);
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
          placeholder="Name"
          value={values.name}
          onChange={e => setValues({ ...values, name: e.target.value })}
        />

        <input
          className="formInput mb-4"
          placeholder="Description"
          value={values.description}
          onChange={e => setValues({ ...values, description: e.target.value })}
        />

        <div className="justify-between flex">
          <button className="formButton" type="submit">
            Add tag
          </button>

          <ButtonDone />
        </div>
      </form>
    </div>
  );
}
