const {connectDB} = require("./db");
const dbPool = connectDB();

const getTodayTasks = (userId) => {
    return new Promise((resolve, reject) => {
        dbPool.query({
            text: "SELECT * FROM tasks WHERE user_id = $1 AND date = CURRENT_DATE",
            values: [userId]
        }, (error, result) => {
            if(error)
                console.log(error);
            else resolve(result.rows);
        });
    });
};

const getTasks = (userId) => {
    return new Promise((resolve, reject) => {
        dbPool.query({
            text: "SELECT * FROM tasks WHERE user_id = $1",
            values: [userId]
        }, (error, result) => {
            if(error)
                console.log(error);
            else resolve(result.rows);
        });
    });
};

module.exports = {
    getTodayTasks,
    getTasks
};