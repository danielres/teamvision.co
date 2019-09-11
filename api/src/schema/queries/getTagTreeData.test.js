const test = require("tape");

const execQuery = require("../../../tests/support/execQuery");
const deleteAllRecords = require("./deleteAllRecords");
const getTagTreeData = require("./getTagTreeData");

const { createTag } = require("./tags");
const { applyTagging } = require("./taggings");

test("getTagTreeData() returns all tags, orphans, roots + taggings,", async assert => {
  await deleteAllRecords();
  await createTag({ name: "root1" });
  await createTag({ name: "parent1" });
  await createTag({ name: "child1" });
  await createTag({ name: "orphan" });
  const root1_parent1 = await applyTagging({
    name: "root1",
    targetValue: "parent1"
  });
  const parent1_child1 = await applyTagging({
    name: "parent1",
    targetValue: "child1"
  });

  const result1 = await getTagTreeData();

  const expected1 = {
    tags: {
      all: ["Child1", "Orphan", "Parent1", "Root1"],
      orphans: ["Orphan", "Root1"],
      roots: ["Root1"]
    },
    taggings: [
      { id: parent1_child1.id, src: "Parent1", tgt: "Child1" },
      { id: root1_parent1.id, src: "Root1", tgt: "Parent1" }
    ]
  };

  assert.deepEqual(result1, expected1);

  assert.end();
});
