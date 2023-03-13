const http = require("http");
const bcrypt = require("bcrypt");
const public = require("./public");
require("dotenv").config();

const {currentDate} = require("./date");
const {connectDB} = require("./db");
const {
    dataValidation,
    getUserFromLogin,
    checkUserNotExists,
    hashPassword,
    createUser,
    createSession,
    deleteSession,
    checkCookie,
    checkSession,
    deleteOutdatedSessions,
} = require("./serverAuth");

const dbPool = connectDB();

const sendFile = (res, contentType, file) => {
    res.writeHead(200, { "content-type": contentType });
    res.end(file);
};

const redirect = (res, location) => {
    res.writeHead(302, { "location": location} );
    res.end();
};

const readData = (req) => {
    return new Promise((resolve) => {
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on("end", () => resolve(JSON.parse(body)));
    });
};

const server = http.createServer((req, res) => {
    if(req.url === "/")
        redirect(res, "/login");
    
    else if(req.url === "/login" && req.method === "GET")
        checkCookie(req)
        .then(sessionId => checkSession(sessionId))
        .then(() => redirect(res, "/home"))
        .catch(() => sendFile(res, "text/html", public.loginHTML));

    else if(req.url === "/login" && req.method === "POST") {
        readData(req)
        .then(data => dataValidation(data))
        .then(data => getUserFromLogin(data))
        .then(user => createSession(user))
        .then(sessionId => {
            console.log(sessionId);
            res.writeHead(302, {
                "set-cookie": `sessionId=${sessionId}`,
                "location": "/home"
            }).end();
        })
        .catch(error => {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify(error));
        });
    }

    else if(req.url === "/login.css")
        sendFile(res, "text/css", public.loginCSS);

    else if(req.url === "/login.js")
        sendFile(res, "text/javascript", public.loginJS);

    else if(req.url === "/logout") {
        checkCookie(req)
        .then(sessionId => deleteSession(sessionId))
        .then(() => {
            res.writeHead(302, {
                "set-cookie": "sessionId=; Max-Age=0",
                "location": "/login"
            }).end();
        })
        .catch(() => redirect(res, "/login"));
    }

    else if(req.url === "/register" && req.method === "GET")
        sendFile(res, "text/html", public.registerHTML);

    else if(req.url === "/register" && req.method === "POST") {
        readData(req)
        .then(data => dataValidation(data))
        .then(data => {
            delete data.repeatPassword;
            return checkUserNotExists(data);
        })
        .then(data => hashPassword(data))
        .then(data => createUser(data))
        .then(user => createSession(user))
        .then(sessionId => {
            res.writeHead(302, {
                "set-cookie": `sessionId=${sessionId}`,
                "location": "/home"
            }).end();
        })
        .catch(error => {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify(error));
        });
    }

    else if(req.url === "/register.css")
        sendFile(res, "text/css", public.registerCSS);

    else if(req.url === "/register.js")
        sendFile(res, "text/javascript", public.registerJS);

    else if(req.url === "/home") {
        checkCookie(req)
        .then(sessionId => checkSession(sessionId))
        .then(() => sendFile(res, "text/html", public.homeHTML))
        .catch(() => redirect(res, "/login"));
    }
    
    else if(req.url === "/home.css")
        sendFile(res, "text/css", public.homeCSS);
    
    else if(req.url === "/home.js")
        sendFile(res, "text/javascript", public.homeJS);
    
    else if(req.url === "/home/tasks") {
        let toSend = {};
        checkCookie(req)
        .then(sessionId => checkSession(sessionId))
        .then(user => {
            toSend.login = user.login;
            toSend.currentDate = currentDate();
            toSend.tasks = [];
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(toSend));
        })
        .catch(() => redirect(res, "/login"));
    }

    else {
        res.writeHead(404, { "content-type": "text/html" });
        res.end("404 Not Found")
    }
});

server.listen(process.env.PORT || 5000);

setInterval(deleteOutdatedSessions, 60000);

process.on("SIGINT", () => {
    dbPool.end(() => console.log("Disconnected from database"));
});