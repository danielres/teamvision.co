import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import SortableTree, {
  addNodeUnderParent,
  getTreeFromFlatData,
  removeNodeAtPath
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
      <div className="flex">
        <div className="w-3/4">
          <form className="flex mb-5" style={{ marginLeft: 44, width: 274 }}>
            <input
              type="text"
              className="w-32 shadow appearance-none w-full px-3 py-2 text-gray-700"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add new tag"
            />
            <button
              className="btn bg-white"
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

        <div className="w-1/4 text-right mr-6 md:mr-0">
          <ButtonDone />
        </div>
      </div>

      <div>
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
    </div>
  );
};
