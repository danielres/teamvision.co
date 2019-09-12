import classnames from "classnames";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-sortable-tree/style.css";
import getTreeFromFlatData from "../getTreeFromFlatData";

const RenderNode = ({ node }) => (
  <li>
    <Link to={`/tags/${node.title}`}>{node.title}</Link>
    {node.children && (
      <ul className="pl-4">
        {node.children.map(n => (
          <RenderNode key={n.title} node={n} />
        ))}
      </ul>
    )}
  </li>
);

const c = {
  filter: "px-2 py-1 border rounded leading-tight inline-block text-sm",
  filter_active: "bg-teal-500 text-white border-white",
  filter_inactive: "text-gray-800 hover:bg-gray-200"
};

export default ({ ButtonDone, flatTreeData: { tags, taggings }, history }) => {
  const treeData = getTreeFromFlatData({ tags, taggings });

  const allFilters = treeData.filter(n => n.children).map(({ title }) => title);
  const [filters, setFilters] = useState(allFilters);
  const addFilter = filter => setFilters([...filters, filter]);
  const removeFilter = filter =>
    filters.length > 1 && setFilters(filters.filter(f => f !== filter));
  const toggleFilter = filter =>
    filters.includes(filter) ? removeFilter(filter) : addFilter(filter);

  const [enableOrphans, setEnableOrphans] = useState(true);
  const toggleOrphans = () => setEnableOrphans(!enableOrphans);

  return (
    <div>
      <nav className="mb-4">
        <div className="flex">
          <div className=" w-3/4">
            <ul className="inline-block">
              {treeData
                .filter(n => n.children)
                .map(({ title }) => (
                  <li className="inline-block" key={title}>
                    <button
                      onClick={() => toggleFilter(title)}
                      className={classnames(
                        "mr-1",
                        c.filter,
                        filters.includes(title)
                          ? c.filter_active
                          : c.filter_inactive
                      )}
                    >
                      {title}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <ul className="inline-block w-1/4">
            <li className="inline-block">
              <button
                className={classnames(
                  "ml-4",
                  c.filter,
                  enableOrphans ? c.filter_active : c.filter_inactive
                )}
                onClick={toggleOrphans}
              >
                Orphans
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex">
        <div
          className={enableOrphans ? "w-3/4" : "w-full"}
          style={{ columns: "4 200px", columnGap: "0" }}
        >
          {treeData
            .filter(n => n.children)
            .filter(({ title }) => filters.includes(title))
            .map(rootNode => (
              <div key={rootNode.title} className="mb-4 border-b pb-4">
                <h2 className="font-semibold">
                  <Link to={`/tags/${rootNode.title}`}>{rootNode.title}</Link>
                </h2>
                {rootNode.children && (
                  <ul className="pl-4">
                    {rootNode.children.map(n => (
                      <RenderNode key={n.title} node={n} />
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>

        {enableOrphans && (
          <div className="w-1/4 border-l pl-4">
            {treeData
              .filter(n => !n.children)
              .map(orphan => (
                <div key={orphan.title}>
                  <Link to={`/tags/${orphan.title}`}>{orphan.title}</Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
