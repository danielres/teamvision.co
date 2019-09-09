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
      all: ["child1", "orphan", "parent1", "root1"],
      orphans: ["orphan", "root1"],
      roots: ["root1"]
    },
    taggings: {
      [root1_parent1.id]: ["root1", "parent1"],
      [parent1_child1.id]: ["parent1", "child1"]
    }
  };

  assert.deepEqual(result1, expected1);

  assert.end();
});
