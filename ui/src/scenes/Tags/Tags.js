import { useQuery } from "@apollo/react-hooks";
import classnames from "classnames";
import React, { useState } from "react";
import Form from "./Form";
import { GET_TAGS } from "./gql";

export default function Tags() {
  const { loading, error, data } = useQuery(GET_TAGS); // eslint-disable-line no-unused-vars
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
            Add tag
          </button>
        </div>
      )}

      <section className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="flex font-semibold">
              <div className="w-1/2 px-4">Name</div>
              <div className="w-1/2 px-4">Description</div>
            </div>

            <ul>
              {data.tags.map(({ description, name }, i) => (
                <li
                  key={description}
                  className={classnames(
                    { "bg-gray-200": !(i % 2) },
                    "flex py-2"
                  )}
                >
                  <div className="w-1/2 px-4">{name}</div>
                  <div className="w-1/2 px-4">{description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
