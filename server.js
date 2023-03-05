const http = require("http");
const bcrypt = require("bcrypt");
const public = require("./public");
const {tasks} = require("./testTasks");
const {currentDate} = require("./date");
const {connectDB} = require("./db");
require("dotenv").config();
const dbPool = connectDB();

const sendFile = (res, contentType, file) => {
    res.writeHead(200, { "content-type": contentType });
    res.end(file);
};

const redirect = (res, location) => {
    res.writeHead(301, { "location": location} );
    res.end();
}

const encrypt = async(password) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
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
    if(req.url === "/")
        redirect(res, "/login");
    
    else if(req.url === "/login" && req.method === "GET")
        sendFile(res, "text/html", public.loginHTML);

    else if(req.url === "/login" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const data = JSON.parse(body);
            res.writeHead(200);
            res.end();
        });
    }

    else if(req.url === "/login.css")
        sendFile(res, "text/css", public.loginCSS);

    else if(req.url === "/login.js")
        sendFile(res, "text/javascript", public.loginJS);

    else if(req.url === "/register" && req.method === "GET")
        sendFile(res, "text/html", public.registerHTML);

    else if(req.url === "/register" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async() => {
            const data = JSON.parse(body);
            let toSend = { "messages": [] };
            if(data.email === "") {
                toSend.messages.push("Podaj email");
            } if(data.nickname === "") {
                toSend.messages.push("Podaj login");
            } if(data.password === "") {
                toSend.messages.push("Podaj hasło");
            } if(data.repeatPassword === "") {
                toSend.messages.push("Podaj ponownie hasło");
            } if(data.password !== data.repeatPassword) {
                toSend.messages.push("Podane hasła nie są identyczne");
            }
            if(toSend.messages.length > 0) {
                res.writeHead(400, { "content-type": "application/json" });
                res.end(JSON.stringify(toSend));
            }

            dbPool.query({
                text: "SELECT user_id FROM users WHERE nickname = $1",
                values: [data.nickname]
            }, (error, result) => {
                if(error) {
                    console.log(error);
                } else if(result.rowCount === 1) {
                    toSend.messages.push("Podany login już istnieje");
                    res.writeHead(400, { "content-type": "application/json" });
                    res.end(JSON.stringify(toSend));
                } else {
                    encrypt(data.password)
                    .then(hashedPassword => { dbPool.query({
                        text: "INSERT INTO users(email, nickname, password) VALUES($1, $2, $3)",
                        values: [data.email, data.nickname, hashedPassword]
                    }, (error, result) => {
                        if(error) {
                            console.log(error);
                        } else {
                            toSend.messages.push("Dodano użytkownika");
                            res.writeHead(200, { "content-type": "application/json" });
                            res.end(JSON.stringify(toSend));
                        }
                    })});
                }
            });
        });
    }

    else if(req.url === "/register.css")
        sendFile(res, "text/css", public.registerCSS);

    else if(req.url === "/register.js")
        sendFile(res, "text/javascript", public.registerJS);

    else if(req.url === "/home")
        sendFile(res, "text/html", public.homeHTML);
    
    else if(req.url === "/home.css")
        sendFile(res, "text/css", public.homeCSS);
    
    else if(req.url === "/home.js")
        sendFile(res, "text/javascript", public.homeJS);
    
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

server.listen(process.env.PORT || 5000);

process.on("SIGINT", () => {
    dbPool.end(() => console.log("Disconnected from database"));
});