const pg = require("pg");

const connectDB = () => {
    const pool = new pg.Pool({
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWD
    });
    return pool;
};

module.exports = {
    connectDB
};