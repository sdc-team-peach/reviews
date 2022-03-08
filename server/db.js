const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "theone321",
  host: "localhost",
  port: 5432,
  database: "sdcreviews"
});

module.exports = pool;
