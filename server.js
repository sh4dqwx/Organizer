const http = require("http");
const public = require("./public");
require("dotenv").config();

const {currentDate} = require("./date");
const {connectDB} = require("./db");
const auth = require("./serverAuth");
const taskController = require("./serverTasks");

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
        auth.checkCookie(req)
        .then(sessionId => auth.checkSession(sessionId))
        .then(() => redirect(res, "/home"))
        .catch(() => sendFile(res, "text/html", public.loginHTML));

    else if(req.url === "/login" && req.method === "POST") {
        readData(req)
        .then(data => auth.dataValidation(data))
        .then(data => auth.getUserFromLogin(data))
        .then(user => auth.createSession(user))
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

    else if(req.url === "/login.css")
        sendFile(res, "text/css", public.loginCSS);

    else if(req.url === "/login.js")
        sendFile(res, "text/javascript", public.loginJS);

    else if(req.url === "/logout") {
        auth.checkCookie(req)
        .then(sessionId => auth.deleteSession(sessionId))
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
        .then(data => auth.dataValidation(data))
        .then(data => {
            delete data.repeatPassword;
            return auth.checkUserNotExists(data);
        })
        .then(data => auth.hashPassword(data))
        .then(data => auth.createUser(data))
        .then(user => auth.createSession(user))
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
        auth.checkCookie(req)
        .then(sessionId => auth.checkSession(sessionId))
        .then(() => sendFile(res, "text/html", public.homeHTML))
        .catch(() => redirect(res, "/login"));
    }
    
    else if(req.url === "/home.css")
        sendFile(res, "text/css", public.homeCSS);
    
    else if(req.url === "/home.js")
        sendFile(res, "text/javascript", public.homeJS);
    
    else if(req.url === "/home/tasks") {
        let toSend = {};
        auth.checkCookie(req)
        .then(sessionId => auth.checkSession(sessionId))
        .then(async(user) => {
            toSend.login = user.login;
            toSend.currentDate = currentDate();
            toSend.tasks = await taskController.getTodayTasks(user.user_id);
            toSend.calendarTasks = [];
            toSend.habitTasks = [];
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(toSend));
        })
        .catch(() => redirect(res, "/login"));
    }

    else if(req.url === "/todolist") {
        auth.checkCookie(req)
        .then(sessionId => auth.checkSession(sessionId))
        .then(() => sendFile(res, "text/html", public.todolistHTML))
        .catch(() => redirect(res, "/login"));
    }

    else if(req.url === "/todolist.css") {
        sendFile(res, "text/css", public.todolistCSS);
    }

    else if(req.url === "/todolist.js") {
        sendFile(res, "text/javascript", public.todolistJS);
    }

    else if(req.url === "/todolist/tasks") {
        let toSend = {};
        auth.checkCookie(req)
        .then(sessionId => auth.checkSession(sessionId))
        .then(async(user) => {
            toSend.categories = await taskController.getTaskCategories();
            toSend.tasks = await taskController.getTasks(user.user_id);
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

setInterval(auth.deleteOutdatedSessions, 60000);

process.on("SIGINT", () => {
    dbPool.end(() => console.log("Disconnected from database"));
});