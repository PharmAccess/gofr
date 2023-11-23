const { Pool, escapeLiteral } = require("pg");

// TODO: this should be in a config file
const pool = new Pool({
  database: "gofr",
  user: "hapi",
  password: "hapi",
  port: 5432,
  host: "localhost",
});
module.exports = { pool, escapeLiteral };