const test = require("tape");

const execQuery = require("./support/execQuery");
const { deleteAllRecords } = require("../src/schema/queries");

test("Query { persons {...} } works", async assert => {
  await deleteAllRecords();

  const { body } = await execQuery(`{ persons { email } }`);
  const expected = { data: { persons: [] } };

  assert.deepEqual(body, expected);

  assert.end();
});
