// const mongoose = require("mongoose");

// const connectToDb = async () => {
//     try {
//         const db = await mongoose.connect(process.env.MONGODB_URI);
//         if (db) {
//             console.log("Connected to DB");
//         }
        
//     } catch (error) {
//         console.log("Error while connecting to db", error);
//     }
// };

// module.exports = connectToDb;


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
        console.log("Connected to PostgreSQL database");
    } catch (error) {
        console.error("Error connecting to PostgreSQL database:", error);
    }
};

module.exports = connectToDb;
