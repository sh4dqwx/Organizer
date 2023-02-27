const http = require("http");
const bcrypt = require("bcrypt");
const public = require("./public");
const {tasks} = require("./testTasks");
const {currentDate} = require("./date");
const {connectDB} = require("./db");
require("dotenv").config();

// async function test() {
//     const dbPool = connectDB();
//     await dbPool.connect();
//     const user = {
//         "email": "test@test.pl",
//         "nickname": "test",
//         "password": "test"
//     };
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(user.password, salt);
//     dbPool.query({
//         text: "INSERT INTO users(email, nickname, password) VALUES($1, $2, $3)",
//         values: [user.email, user.nickname, hashedPassword]
//     }, (err, res) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Dodano użytkownika");
//         }
//     });
//     dbPool.end();
// }

const server = http.createServer((req, res) => {
    if(req.url === "/") {
        res.writeHead(301, { "location": "/login" });
        res.end();
    }
    
    else if(req.url === "/login") {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(public.loginHTML);
    }

    else if(req.url === "/login.css") {
        res.writeHead(200, { "content-type": "text/css" });
        res.end(public.loginCSS);
    }

    else if(req.url === "/home") {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(public.homeHTML);
    }
    
    else if(req.url === "/home.css") {
        res.writeHead(200, { "content-type": "text/css" });
        res.end(public.homeCSS);
    }
    
    else if(req.url === "/home.js") {
        res.writeHead(200, { "content-type": "text/javascript" });
        res.end(public.homeJS);
    }
    
    else if(req.url === "/home/tasks") {
        let toSend = {};
        toSend["currentDate"] = currentDate();
        toSend["tasks"] = [];
        tasks.forEach(task => {
            toSend.tasks.push(task);
        });

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(toSend));
    }
    
    else {
        res.writeHead(404, { "content-type": "text/html" });
        res.end("404 Not Found")
    }
});

server.listen(process.env.PORT);