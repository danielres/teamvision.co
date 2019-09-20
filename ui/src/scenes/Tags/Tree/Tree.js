import classnames from "classnames";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-sortable-tree/style.css";
import getTreeFromFlatData from "../getTreeFromFlatData";

const RenderNode = ({ node }) => (
  <li>
    <Link
      className="inline-block hover:bg-yellow-200 px-2 py-1 leading-tight "
      to={`/tags/${node.title}`}
    >
      {node.title}
    </Link>
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

  const orphans = treeData.filter(n => !n.children);
  const [enableOrphans, setEnableOrphans] = useState(orphans.length > 0);
  const toggleOrphans = () => setEnableOrphans(!enableOrphans);

  return (
    <div>
      <nav className="mb-4">
        <div className="flex">
          <div className="w-3/4">
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

          {orphans.length > 0 && (
            <ul className="md:w-1/4 text-right">
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
          )}
        </div>
      </nav>

      <div className="md:flex md:flex-row-reverse">
        {enableOrphans && (
          <div className="md:w-1/4 md:border-l md:pl-4 pt-4">
            <div className="font-semibold md:hidden">Orphans</div>
            {orphans.map(orphan => (
              <div key={orphan.title}>
                <Link
                  className="inline-block hover:bg-yellow-200 px-2 py-1 leading-tight "
                  to={`/tags/${orphan.title}`}
                >
                  {orphan.title}
                </Link>
              </div>
            ))}
            <hr className="my-4 md:hidden" />
          </div>
        )}

        <div
          className={enableOrphans ? "w-3/4" : "w-full"}
          style={{ columns: "4 200px", columnGap: "0" }}
        >
          {treeData
            .filter(n => n.children)
            .filter(({ title }) => filters.includes(title))
            .map(rootNode => (
              <div key={rootNode.title} className="inline-block w-full py-2">
                <div
                  className="border border-transparent hover:border-gray-400 rounded p-2"
                  style={{ position: "relative", top: -2 }}
                >
                  <h2 className="font-semibold">
                    <Link
                      className="block px-2 py-1 hover:bg-yellow-200"
                      to={`/tags/${rootNode.title}`}
                    >
                      {rootNode.title}
                    </Link>
                  </h2>
                  {rootNode.children && (
                    <ul className="pl-4">
                      {rootNode.children.map(n => (
                        <RenderNode key={n.title} node={n} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
