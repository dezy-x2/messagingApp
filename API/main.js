const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const database = require("./database.js");

app.use(cors());
app.use(logger("dev"));

app.get("/", (req, res, next) => {
    res.send(`Hello folks \n ${database}`);
});


app.listen(9000, () => {
    console.log("Listening on port 9000");
    console.log(database);
});