const http = require("http");
const public = require("./public");
const {tasks} = require("./testTasks");
const {currentDate} = require("./date");

const server = http.createServer((req, res) => {
    if(req.url === "/") {
        res.writeHead(301, { "location": "/home" });
        res.end();
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

server.listen(5000);