import React from "react";
import { ContainerQuery } from "react-container-query";
import classnames from "classnames";
import { Link } from "react-router-dom";

export default ({ items, onRowClick, rows }) => {
  return (
    <ContainerQuery
      query={{
        "container-xs": { maxWidth: 320 },
        "container-sm": { minWidth: 320, maxWidth: 640 },
        "container-md": { minWidth: 640 }
      }}
    >
      {params => (
        <table className={classnames(params, "striped w-full")} role="table">
          <thead>
            <tr role="row">
              {Object.values(rows).map(text => (
                <th key={text} role="columnheader">
                  {text}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr
                className={onRowClick ? "hover" : ""}
                key={JSON.stringify(item)}
                onClick={() => {
                  if (onRowClick) onRowClick(item.id);
                }}
                role="row"
              >
                {Object.entries(rows).map(([k, v]) => (
                  <td data-name={v} key={`${k}`} role="cell">
                    {item[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ContainerQuery>
  );
};
