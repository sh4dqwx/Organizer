const {connectDB} = require("./db");
const dbPool = connectDB();
const bcrypt = require("bcrypt");

const dataValidation = (dataJSON) => {
    return new Promise((resolve, reject) => {
        let errorJSON = { "error": [] };
        if(dataJSON.email === "")
            errorJSON.error.push("Podaj email");
        if(dataJSON.login === "")
            errorJSON.error.push("Podaj login");
        if(dataJSON.password === "")
            errorJSON.error.push("Podaj hasło");
        if(dataJSON.repeatPassword === "")
            errorJSON.error.push("Podaj hasło drugi raz");
        if(dataJSON.repeatPassword !== undefined && dataJSON.password !== dataJSON.repeatPassword)
            errorJSON.error.push("Podane hasła nie są takie same");
        if(errorJSON.error.length > 0) reject(errorJSON);
        else resolve(dataJSON);
    });
};

const getUserFromLogin = (data) => {
    return new Promise((resolve, reject) => {
        dbPool.query({
            text: "SELECT * FROM users WHERE login = $1",
            values: [data.login]
        }, (err, res) => {
            if(err)
                console.log(err);
            else if(res.rowCount === 0)
                reject({ "error": ["Podany użytkownik nie istnieje"] });
            else bcrypt.compare(data.password, res.rows[0].password, (errC, resC) => {
                if(errC)
                    console.log(errC);
                else if(!resC)
                    reject({ "error": ["Niepoprawne hasło"] });   
                else resolve(res.rows[0]);
            });
        });
    });
};

const checkUserNotExists = (data) => {
    return new Promise((resolve, reject) => {
        dbPool.query({
            text: "SELECT * FROM users WHERE login = $1",
            values: [data.login]
        }, (err, res) => {
            if(err)
                console.log(err);
            else if(res.rowCount === 0)
                resolve(data);
            else reject({ "error": ["Podany użytkownik już istnieje"] });
        });
    });
};

const hashPassword = (data) => {
    return new Promise((resolve) => {
        bcrypt.genSalt()
        .then(salt => bcrypt.hash(data.password, salt))
        .then(password => {
            data.password = password;
            resolve(data);
        })
        .catch(error => console.log(error));
    });
};

const createUser = (data) => {
    return new Promise((resolve) => {
        dbPool.query({
            text: "INSERT INTO users(email, login, password) VALUES($1, $2, $3)",
            values: [data.email, data.login, data.password]
        }, (err) => {
            if(err)
                console.log(err);
            else {
                dbPool.query({
                    text: "SELECT * FROM users WHERE login = $1",
                    values: [data.login]
                }, (err2, res) => {
                    if(err2)
                        console.log(err2);
                    else resolve(res.rows[0]);
                });
            }
        });
    });
};

const createSession = (user) => {
    return new Promise((resolve) => {
        const sessionId = Math.random().toString(36).substring(2, 15);
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1);
        dbPool.query({
            text: "INSERT INTO sessions VALUES($1, $2, $3)",
            values: [sessionId, user.user_id, expirationTime]
        }, (err) => {
            if(err)
                console.log(err);
            else {
                dbPool.query({
                    text: "UPDATE users SET recentlogin = NOW() WHERE user_id = $1",
                    values: [user.user_id]
                })
                resolve(sessionId);
            }
        });
    });
};

const deleteSession = (sessionId) => {
    return new Promise((resolve) => {
        dbPool.query({
            text: "DELETE FROM sessions WHERE session_id = $1",
            values: [sessionId]
        }, (err) => {
            if(err)
                console.log(err);
            else resolve();
        });
    });
};

const checkCookie = (req) => {
    return new Promise((resolve, reject) => {
        const cookieList = req.headers.cookie.split(" ");
        let sessionCookie = undefined;
        cookieList.forEach(cookie => {
            cookie = cookie.split("=");
            console.log(cookie);
            if(cookie[0] === "sessionId") {
                sessionCookie = cookie[1];
                return;
            }
        });

        if(sessionCookie === undefined)
            reject();
        else resolve(sessionCookie);
    })
}

const checkSession = (sessionId) => {
    return new Promise((resolve, reject) => {
        dbPool.query({
            text: "SELECT * FROM users WHERE user_id = (SELECT user_id FROM sessions WHERE session_id = $1)",
            values: [sessionId]
        }, (error, result) => {
            if(error)
                console.log(error);
            else if(result.rowCount === 0)
                reject();
            else resolve(result.rows[0]);
        });
    });
};

const deleteOutdatedSessions = () => {
    dbPool.query("DELETE FROM sessions WHERE expiration_time < NOW()");
};

module.exports = {
    dataValidation,
    getUserFromLogin,
    checkUserNotExists,
    hashPassword,
    createUser,
    createSession,
    deleteSession,
    checkCookie,
    checkSession,
    deleteOutdatedSessions
}