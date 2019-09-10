const test = require("tape");

const execQuery = require("../../../tests/support/execQuery");
const deleteAllRecords = require("./deleteAllRecords");
const { setTagParent } = require("./taggings");

const { createTag } = require("./tags");
const { applyTagging } = require("./taggings");
const getTagTreeData = require("./getTagTreeData");

test("setTagParent() creates, replaces or deletes the Tagging relationship", async assert => {
  await deleteAllRecords();
  await createTag({ name: "root" });
  await createTag({ name: "parent" });
  await createTag({ name: "child" });

  // 1) Creates Tagging relationships
  const r_p = await setTagParent({ parentName: "root", tagName: "parent" });
  const p_c = await setTagParent({ parentName: "parent", tagName: "child" });

  const tagTreeData = await getTagTreeData();

  assert.deepEqual(tagTreeData, {
    tags: {
      all: ["child", "parent", "root"],
      orphans: ["root"],
      roots: ["root"]
    },
    taggings: [
      { id: p_c.id, src: "parent", tgt: "child" },
      { id: r_p.id, src: "root", tgt: "parent" }
    ]
  });

  // 2) Deletes the Tagging relationship when parentName === null
  await setTagParent({ parentName: null, tagName: "parent" });

  const tagTreeData2 = await getTagTreeData();

  assert.deepEqual(tagTreeData2, {
    tags: {
      all: ["child", "parent", "root"],
      orphans: ["parent", "root"],
      roots: ["parent"]
    },
    taggings: [{ id: p_c.id, src: "parent", tgt: "child" }]
  });

  // 3) Replaces the Tagging relationship
  const r_c = await setTagParent({ parentName: "root", tagName: "child" });

  const tagTreeData3 = await getTagTreeData();

  assert.deepEqual(tagTreeData3, {
    tags: {
      all: ["child", "parent", "root"],
      orphans: ["parent", "root"],
      roots: ["root"]
    },
    taggings: [{ id: r_c.id, src: "root", tgt: "child" }]
  });

  assert.end();
});
