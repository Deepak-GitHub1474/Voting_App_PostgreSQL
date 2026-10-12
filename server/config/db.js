const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const connection = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
          host: process.env.POSTGRESQL_HOST,
          port: process.env.POSTGRESQL_PORT,
          database: process.env.POSTGRESQL_DATABASE,
          user: process.env.POSTGRESQL_USER,
          password: process.env.POSTGRESQL_PASSWORD,
      };

// Fail fast instead of hanging requests when the database is unreachable.
const pool = new Pool({ ...connection, max: 10, connectionTimeoutMillis: 5000, query_timeout: 10000 });

pool.on("error", (error) => console.log("Idle DB client error", error));

const connectToDb = async () => {
    try {
        await pool.query(fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8"));
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error while connecting to db", error);
    }
};

module.exports = connectToDb;
module.exports.pool = pool;
