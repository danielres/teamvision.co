import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Form from "./Form";
import Table from "./Table";
import Tree from "./Tree";

function Tags({ history }) {
  const [active, setActive] = useState("default");

  const ButtonDone = ({ className = "btn" }) => (
    <button className={className} onClick={() => setActive("default")}>
      Done
    </button>
  );

  return (
    <>
      {active === "form" && (
        <div className="card">
          <Form ButtonDone={ButtonDone} />
        </div>
      )}
      {active === "tree" && (
        <section>
          <div className="text-right">
            <ButtonDone className="btn bg-white mb-4 shadow mr-6 md:mr-0" />
          </div>
          <Tree />
        </section>
      )}
      {active === "default" && (
        <div className="text-right">
          <button
            className="btn bg-white mb-4 shadow mr-2"
            onClick={() => setActive("form")}
          >
            Add tag
          </button>
          <button
            className="btn bg-white mb-4 shadow mr-6 md:mr-0"
            onClick={() => setActive("tree")}
          >
            Manage
          </button>
        </div>
      )}
      {["default", "form"].includes(active) && (
        <section className="card">
          <Table />
        </section>
      )}
    </>
  );
}

export default withRouter(Tags);
