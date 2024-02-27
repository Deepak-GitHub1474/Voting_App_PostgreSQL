const { Client } = require('pg');

const connectToDb = async () => {
    try {
        const client = new Client({
            host: process.env.POSTGRESQL_HOST,
            port: process.env.POSTGRESQL_PORT,
            database: process.env.POSTGRESQL_DATABASE,
            user: process.env.POSTGRESQL_USER,
            password: process.env.POSTGRESQL_PASSWORD,
        });
        await client.connect();
        // console.log("Connected to DB");
        return client;
    } catch (error) {
        console.error("Error while connecting to DB:", error);
    }
};

module.exports = connectToDb;
