const { _genId } = require("../schema/queries/private");
const driver = require("../neo4jDriver");

const purgeDb = () => ({ query: `MATCH (n) DETACH DELETE n` });

const createTag = ({ description = "", name }) => ({
  query:
    "CREATE (tag:Tag {description: {description}, name: {name}, id: {tagId} }) RETURN tag",
  params: { description, name, tagId: _genId() }
});

const setTagChild = ({ src, tgt }) => ({
  query: `
    MATCH (tag:Tag {name: {name} })
    MATCH (target: Tag {name: {targetValue}})
    CREATE (tag)-[tagging:TAGGING {id: {taggingId}, description: {description}}]->(target)
    RETURN tagging, tag, target
    `,
  params: {
    name: src,
    description: "",
    targetLabel: "Tag",
    targetKey: "name",
    targetValue: tgt,
    taggingId: _genId()
  }
});

const addTagChild = ({ src, tgt }) => {
  return [createTag({ name: tgt }), setTagChild({ src, tgt })];
};

const commands = [
  // purgeDb(),
  createTag({ name: "Web development" }),
  addTagChild({ src: "Web development", tgt: "Frontend" }),
  addTagChild({ src: "Web development", tgt: "Backend" }),
  addTagChild({ src: "Frontend", tgt: "Frameworks" }),
  addTagChild({ src: "Frameworks", tgt: "React" }),
  addTagChild({ src: "Frontend", tgt: "State management" }),
  addTagChild({ src: "State management", tgt: "Redux" }),
  addTagChild({ src: "Redux", tgt: "Redux-saga" }),
  addTagChild({ src: "Redux", tgt: "Redux-thunk" }),
  addTagChild({ src: "State management", tgt: "Mobx" })
];

const runSeed = async () => {
  const session = driver.session();

  console.log("\n");
  commands.flat().forEach(async ({ query, params }) => {
    console.log({ query, params });
    console.log("\n");
    await session.run(query, params);
  });

  await session.close();
  console.log(`${commands.flat().length} commands executed`);
};

runSeed();
