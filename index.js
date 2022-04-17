// Place your server entry point code here
const args = require("minimist")(process.argv.slice(2));
const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const db = require("./database.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const help = (`
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`)
if (args.help || args.h) {
    console.log(help);
    process.exit(0);
}


const port = args.port || args.p || 5000;


const server = app.listen(port, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", port));
});

if (args.log === "true") {
    const logStream = fs.createWriteStream('access.log', { flags: "a" });
    app.use(morgan("combined", { stream: logStream }));
}

// app.use((req, res, next) => {
//     if (args.debug || args.d) {
//         let logdata = {
//             remoteaddr: req.ip ?? null,
//             remoteuser: req.user ?? null,
//             time: Date.now() ?? null,
//             method: req.method ?? null,
//             url: req.url ?? null,
//             protocol: req.protocol ?? null,
//             httpversion: req.httpVersion ?? null,
//             status: res.statusCode ?? null,
//             referrer: req.headers["referer"] ?? null,
//             useragent: req.headers["user-agent"] ?? null,
//         };
//         const stmt = db.prepare(
//             "INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
//         );
//         const info = stmt.run(
//             logdata.remoteaddr,
//             logdata.remoteuser,
//             logdata.time,
//             logdata.method,
//             logdata.url,
//             logdata.protocol,
//             logdata.httpversion,
//             logdata.status,
//             logdata.referrer,
//             logdata.useragent
//         );
//         console.log(logdata);
//         next();
//     }
// });

function coinFlip() {
    let randomNum = Math.random();
    if (randomNum > 0.5) {
        return "heads";
    } else {
        return "tails";
    }
}
function coinFlips(flips) {
    const coinArray = [];
    for (let i = 0; i < flips; i++) {
        let randomNum = Math.random();
        if (randomNum > 0.5) {
            coinArray[i] = "heads";
        } else {
            coinArray[i] = "tails";
        }
    }
    return coinArray;
}
function countFlips(array) {
    let headsCount = 0;
    let tailsCount = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "heads") {
            headsCount++;
        } else {
            tailsCount++;
        }
    }
    return {
        tails: tailsCount,
        heads: headsCount,
    };
}
function flipACoin(call) {
    let result = coinFlip();
    if (result == call) {
        return {
            call: call,
            flip: result,
            result: "win",
        };
    } else {
        return {
            call: call,
            flip: result,
            result: "lose",
        };
    }
}

app.get("/app/", (req, res, next) => {
    res.statusCode = 200;
    res.statusMessage = "OK";
    res.writeHead(res.statusCode, { "Content-Type": "text/plain" });
    res.end(res.statusCode + " " + res.statusMessage);
});

app.get("/app/flip/", (req, res) => {
    res.statusCode = 200;
    let result = coinFlip();
    res.send('{"flip":"' + result + '"}');
});

app.get("/app/flips/:number", (req, res) => {
    let flips = coinFlips(req.params.number);
    let flipsCount = countFlips(flips);

    res.status(200).json({
        raw: flips,
        summary: flipsCount,
    });
});

app.get("/app/flip/call/tails/", (req, res) => {
    res.statusCode = 200;
    let result = flipACoin("tails");
    res.send(result);
});

app.get("/app/flip/call/heads/", (req, res) => {
    res.statusCode = 200;
    let result = flipACoin("heads");
    res.send(result);
});

if (args.debug || args.d) {
    app.get("/app/log/access/", (req, res) => {
        try {
            const stmt = db.prepare("SELECT * FROM accesslog").all();
            res.status(200).json(stmt);
        } catch (e) {
            console.error(e);
        }
    })
    app.get("/app/error/", (req, res) => {
        res.status(500).send("Error test successful");
    })
}

app.use(function (req, res) {
    res.status(404).send("404 NOT FOUND");
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("\nApp stopped.");
    });
});

