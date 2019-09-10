import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import SortableTree, {
  addNodeUnderParent,
  getTreeFromFlatData,
  removeNodeAtPath,
  toggleExpandedForAll
} from "react-sortable-tree";
import "react-sortable-tree/style.css";
import { SET_TAG_PARENT } from "../gql";

const preProcess = ({ tags, taggings }) =>
  getTreeFromFlatData({
    flatData: tags.all.map(name => ({ title: name })),
    getKey: node => node.title,
    getParentKey: node => {
      const tagging = taggings.find(t => t.tgt === node.title);
      return tagging ? tagging.src : null;
    },
    rootKey: null
  });

export default ({ ButtonDone, flatTreeData: { tags, taggings }, history }) => {
  const [treeData, setTreeData] = useState(preProcess({ tags, taggings }));
  const [newTag, setNewTag] = useState("");
  const [setTagParent, response] = useMutation(SET_TAG_PARENT);

  const onMoveNode = args => {
    const tagName = args.node.title;
    const parentName = args.nextParentNode ? args.nextParentNode.title : null;
    setTagParent({ variables: { tagName, parentName } });
  };

  const addChild = ({ name = "Child", path }) => {
    setTreeData(
      addNodeUnderParent({
        addAsFirstChild: true,
        expandParent: true,
        getNodeKey,
        newNode: { title: name },
        parentKey: path[path.length - 1],
        treeData
      }).treeData
    );
  };

  const deleteNode = ({ path }) => {
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey
      })
    );
  };

  const getNodeKey = ({ treeIndex }) => treeIndex;

  const toggleNodeExpansion = expanded =>
    setTreeData(toggleExpandedForAll({ treeData, expanded }));

  if (response.error)
    return (
      <div className="card">
        <p>An error occured while updating the graph.</p>{" "}
        <p>
          Please{" "}
          <button className="btn" onClick={() => window.location.reload()}>
            refresh
          </button>{" "}
          and try again.
        </p>
      </div>
    );

  return (
    <div>
      <div className=" text-right mr-6 md:mr-0 mb-4">
        <ButtonDone />
      </div>

      <div className="flex">
        <div className="w-full md:w-2/3" style={{ marginTop: -10 }}>
          <SortableTree
            isVirtualized={false}
            treeData={treeData}
            onChange={setTreeData}
            onMoveNode={onMoveNode}
            generateNodeProps={({ node, path }) => ({
              buttons: [
                <button className="btn" onClick={() => deleteNode({ path })}>
                  ×
                </button>,
                <button className="btn" onClick={() => addChild({ path })}>
                  +
                </button>
              ]
            })}
          />
        </div>

        <div className="w-64 md:w-1/3 card">
          <div className="md:flex">
            <button
              className="btn mb-4 mr-4 w-full text-left md:text-center"
              onClick={() => toggleNodeExpansion(true)}
            >
              Expand all
            </button>
            <button
              className="btn mb-4 w-full text-left md:text-center"
              onClick={() => toggleNodeExpansion(false)}
            >
              Collapse all
            </button>
          </div>
          <form className="flex">
            <input
              id="newTag"
              type="text"
              className="formInput"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="New tag"
            />
            <button
              className="formButton hidden md:block"
              onClick={e => {
                e.preventDefault();
                setTreeData([{ title: newTag }, ...treeData]);
                setNewTag("");
              }}
            >
              +
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
