const test = require("tape");

const execQuery = require("../../../tests/support/execQuery");
const deleteAllRecords = require("./deleteAllRecords");
const { setTagParent } = require("./taggings");

const getTagTreeData = require("./getTagTreeData");
const { applyTagging, setTagOn } = require("./taggings");
const { createPerson } = require("./persons");
const { createTag, searchTags } = require("./tags");

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
      all: ["Child", "Parent", "Root"],
      orphans: ["Root"],
      roots: ["Root"]
    },
    taggings: [
      { id: p_c.id, src: "Parent", tgt: "Child" },
      { id: r_p.id, src: "Root", tgt: "Parent" }
    ]
  });

  // 2) Deletes the Tagging relationship when parentName === null
  await setTagParent({ parentName: null, tagName: "parent" });

  const tagTreeData2 = await getTagTreeData();

  assert.deepEqual(tagTreeData2, {
    tags: {
      all: ["Child", "Parent", "Root"],
      orphans: ["Parent", "Root"],
      roots: ["Parent"]
    },
    taggings: [{ id: p_c.id, src: "Parent", tgt: "Child" }]
  });

  // 3) Replaces the Tagging relationship
  const r_c = await setTagParent({ parentName: "root", tagName: "child" });

  const tagTreeData3 = await getTagTreeData();

  assert.deepEqual(tagTreeData3, {
    tags: {
      all: ["Child", "Parent", "Root"],
      orphans: ["Parent", "Root"],
      roots: ["Root"]
    },
    taggings: [{ id: r_c.id, src: "Root", tgt: "Child" }]
  });

  assert.end();
});

test("setTagOn() creates a Tagging relationship with an existing, or a new tag", async assert => {
  await deleteAllRecords();
  const existing = await createTag({ name: "existingTag" });
  const person = await createPerson({ email: "tom@example.com", name: "Tom" });

  const taggingWithExistingTag = await setTagOn({
    tagName: "existingTag",
    on: "skills",
    targetType: "Person",
    targetId: person.id
  });

  assert.deepEqual(taggingWithExistingTag, {
    description: "",
    id: taggingWithExistingTag.id,
    on: "skills",
    tag: { name: "ExistingTag", description: "", id: existing.id },
    target: {
      label: "Person",
      name: "Tom",
      email: "tom@example.com",
      id: person.id
    }
  });

  const taggingWithNewTag = await setTagOn({
    tagName: "newTag",
    on: "motivations",
    targetType: "Person",
    targetId: person.id
  });

  const newTag = (await searchTags("newTag"))[0];

  assert.deepEqual(taggingWithNewTag, {
    description: "",
    id: taggingWithNewTag.id,
    on: "motivations",
    tag: { name: "NewTag", description: "", id: newTag.id },
    target: {
      label: "Person",
      name: "Tom",
      email: "tom@example.com",
      id: person.id
    }
  });

  assert.end();
});
