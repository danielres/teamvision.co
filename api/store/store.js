const Knex = require("knex");
const knexfile = require("./knexfile");

let cached;

const getKnex = () => (cached = cached ? cached : new Knex(knexfile));

const close = () => {
  if (!cached) return;
  cached.destroy();
  cached = undefined;
};

export default {
  getKnex
};
