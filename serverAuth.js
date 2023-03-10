const dataValidation = (dataJSON) => {
    return new Promise((resolve, reject) => {
        let errorJSON = { "error": [] };
        if(dataJSON.email === "")
            errorJSON.error.push("Podaj email");
        if(dataJSON.login === "")
            errorJSON.error.push("Podaj login");
        if(dataJSON.password === "")
            errorJSON.error.push("Podaj hasło");
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
            else resolve(sessionId);
        });
    });
};

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
    createSession,
    checkSession,
    deleteOutdatedSessions
}