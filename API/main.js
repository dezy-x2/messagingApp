const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const database = require("./database.js");
const bodyParser = require("body-parser");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser());

function generateId() {
    let id = Math.floor(Math.random() * 1000);
    for (let user of database) {
        if (user.id === id) {
            return generateId();
        }
    }
    return id;
}

app.get("/", (req, res, next) => {
    res.send(`Hello folks \n ${database}`);
});

app.post("/acc/crt", (req, res, next) => {
    console.log("got here")
    let username = req.body.username;
    let password = req.body.password;
    let id = generateId();
    if (username === "test" && password === "test") {
        res.send("Test succesfult");
        console.log("Test succesful");
        console.log(database);
        return;
    }
    for (let user of database) {
        if (user.username === username) {
            res.status(500).send();
            return;
        }
    }
    database.push(
        {
            "password": password,
            "username": username,
            "messages": {
            "outMessages": [],
            "inMessages": [],
            },
            "id": id
        }
    );
    return res.send(JSON.stringify(id));
})

app.get("/acc/fetch/:username/:password", (req, res, next) => {
    const username = req.params.username;
    const password = req.params.password;
    if (username === "test" && password === "test") {
        res.send("Test succesful");
        console.log("Test succesful");
        console.log(database);
        return;
    }
    for (let user of database) {
        if (user.username === username) {
            if (user.password === password) {
                res.send(JSON.stringify(user.id));
                return;
            }
        }
    }
    res.status(500).send();
})

app.listen(9000, () => {
    console.log("Listening on port 9000");
    console.log(database);
});