import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Form from "./Form";
import Manager from "./Manager";
import Tree from "./Tree";

const Tags = ({ history }) => {
  const [active, setActive] = useState("default");

  const ButtonDone = ({ className = "btn bg-white shadow" }) => (
    <button className={className} onClick={() => history.push("/tags")}>
      Done
    </button>
  );

  const tab = history.location.query.tab
    ? history.location.query.tab
    : "default";

  return (
    <>
      {tab === "form" && (
        <div className="card">
          <Form ButtonDone={ButtonDone} />
        </div>
      )}

      {tab === "manage" && <Manager ButtonDone={ButtonDone} />}

      {tab === "default" && (
        <div className="text-right">
          <button
            className="btn bg-white mb-4 shadow mr-2"
            onClick={() => history.push("/tags?tab=form")}
          >
            Add tag
          </button>
          <button
            className="btn bg-white mb-4 shadow mr-6 md:mr-0"
            onClick={() => history.push("/tags?tab=manage")}
          >
            Manage
          </button>
        </div>
      )}

      {["default", "form"].includes(tab) && (
        <section className="card">
          <Tree />
        </section>
      )}
    </>
  );
};

export default withRouter(Tags);
