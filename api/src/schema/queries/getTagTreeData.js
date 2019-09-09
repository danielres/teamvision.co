const driver = require("../../neo4jDriver");
const { _execQuery } = require("./private");

const getAllTaggings = async () => {
  const query = `
    MATCH (src:Tag) -[rel:TAGGING]-> (tgt:Tag)
    RETURN src, rel, tgt`;
  const records = await _execQuery(query);
  return records.map(r => {
    const src = r.get("src").properties.name;
    const tgt = r.get("tgt").properties.name;
    const id = r.get("rel").properties.id;
    return { id, src, tgt };
  });
};

const getAllTags = async () => {
  const query = `MATCH (t:Tag) RETURN t`;
  const records = await _execQuery(query);
  return records.map(r => {
    const tag = r.get("t").properties.name;
    return tag;
  });
};

async function getTagTreeData() {
  const allTags = (await getAllTags()).sort();
  const taggings = await getAllTaggings();

  const sources = Object.values(taggings).map(t => t.src);
  const targets = Object.values(taggings).map(t => t.tgt);
  const orphans = allTags.filter(t => !targets.includes(t));
  const roots = orphans.filter(o => sources.includes(o));

  const result = {
    tags: { all: allTags, orphans, roots },
    taggings
  };

  return result;
}

module.exports = getTagTreeData;
