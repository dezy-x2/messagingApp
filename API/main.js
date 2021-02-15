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
                res.send(user);
                // res.send(JSON.stringify({"userOutMessages": user.messages.outMessages, "userInMessages": user.messages.inMessages, "userId": user.id}));
                return;
            }
        }
    }
    res.status(500).send();
})

app.post("/messages/send", (req, res, next) => {
    const id = req.body.id;
    const recepient = req.body.recepient;
    const message = req.body.message;
    let sender = null;
    let completed = "";
    for (let user of database) {
        if (user.id == id) {
            user.messages["outMessages"].push(message);
            completed += "comp";
            console.log(user.messages);
            sender = user;
        };
    };

    for (let user of database) {
        if (user.username === recepient) {
            user.messages["inMessages"].push(message);
            completed += "leted";
            console.log(user.messages);
        };
    };

    if (completed === "completed") {
        res.send({"userOutMessages": sender.messages.outMessages, "userInMessages": sender.messages.inMessages, "userId": sender.id});
        console.log(database);
    } else if (completed === "comp") {
        console.log(database);
        res.status(400).send("That user does not exist");
    } else if (completed === "leted") {
        console.log(database);
        res.status(500).send("User id invalid");
    } else {
        console.log(database);
        res.status(400).send("really bad");
    }
})

app.listen(9000, () => {
    console.log("Listening on port 9000");
    console.log(database);
});