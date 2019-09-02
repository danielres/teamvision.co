const test = require("tape");
const execQuery = require("./support/execQuery");

test("Query { persons {...} } works", async assert => {
  const data = await execQuery(`{ persons { email } }`);
  const expected = { persons: [] };

  assert.deepEqual(data, expected);

  assert.end();
});