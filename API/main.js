const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const database = require("./database.js");
const bodyParser = require("body-parser");
const KeyGenerator = require("./cipherKeyGenerator.js");
const { Client } = require("pg");

const client = new Client({
    user: 'danieldesmond',
    host: 'localhost',
    database: 'danieldesmond',
    port: 5432
});

client.connect();

const keyGen = new KeyGenerator();
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser());

async function generateId() {
    let id = Math.floor(Math.random() * 1000);
    const dbres = await client.query(`SELECT * FROM users`);
    for (let user of dbres.rows) {
        if (user.id === id) {
            return generateId();
        }
    }
    return id;
}

app.get("/", async (req, res, next) => {
    const query = `SELECT * FROM users, messages`;
    try {
        const dbres = await client.query(`SELECT * FROM users WHERE username = 'username' AND password = 'password'`);
        res.send(`Hello folks \n ${dbres.rows}`);
        console.log(dbres.rows, "row");
    } catch(e) {
        console.log(e)
    }
    
});

app.post("/acc/crt", async (req, res, next) => {
    console.log("got here")
    let username = req.body.username;
    let password = req.body.password;
    let id = await generateId();

    try{
        console.log(username, password, id)
        const userInsert = await client.query(`INSERT INTO users (username, password, id) VALUES ('${username}', '${password}', ${id})`);
        console.log("now here")
        const messageInsert = await client.query(`INSERT INTO messages (in_messages, out_messages, user_id) VALUES (ARRAY[ARRAY[NULL, NULL, 
        NULL, NULL,NULL, NULL, NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL,NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL]], 
        ARRAY[ARRAY[NULL, NULL, 
        NULL, NULL,NULL, NULL, NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL,NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 
        NULL, NULL, NULL, NULL]], ${id})`);
    
    } catch(e) {
        console.log(e.stack);
        return res.status(400).send("ERROR");
    }
    return res.send({
        "password": password,
        "username": username,
        "messages": {
        "outMessages": [[null, null, 
            null, null,null, null, null, null, null, null, 
            null, null, null,null, null, null, null,
            null, null, null, null, null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null,
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null,
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null]],
        "inMessages": [[null, null, 
            null, null,null, null, null, null, null, null, 
            null, null, null,null, null, null, null,
            null, null, null, null, null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null,
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null,
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null,null, null, null, null, 
            null, null, null, null]],
        },
        "id": id
    });
})

app.get("/acc/fetch/:username/:password", async (req, res, next) => {
    const username = req.params.username;
    const password = req.params.password;
    
    try {
        const dbres = await client.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);
        const id = dbres.rows[0].id
        console.log(dbres.rows, "auth");
        if (dbres.rowCount < 1) {
            res.status(400).send();
        } else {
            try {
                const idres = await client.query(`SELECT * FROM messages WHERE user_id = ${id}`);
                console.log(idres.rows, "id")
                res.send({
                    "username": dbres.rows[0].username,
                    "id": dbres.rows[0].id,
                    "messages": {
                        "outMessages": idres.rows[0].out_messages,
                        "inMessages": idres.rows[0].in_messages
                    }
                });
            } catch(e) {
                console.log(e);
                res.status(500).send();
            }
        }
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
    
})

async function refresher(id) {
    const dbres = await client.query(`SELECT * FROM users`);
        for (let user of dbres.rows) {
            if (user.id == id) {
                const idres = await client.query(`SELECT * FROM messages WHERE user_id = ${id}`);
                return {
                    "username": user.username,
                    "id": user.id,
                    "messages": {
                        "outMessages": idres.rows[0].out_messages,
                        "inMessages": idres.rows[0].in_messages
                    }
                }
            }
        }
}

app.post("/messages/send", async(req, res, next) => {
    const id = req.body.id;
    if (req.body.refresh) {
        const dbres = await client.query(`SELECT * FROM users`);
        for (let user of dbres.rows) {
            if (user.id == id) {
                const idres = await client.query(`SELECT * FROM messages WHERE user_id = ${id}`);
                return res.send({
                    "username": user.username,
                    "id": user.id,
                    "messages": {
                        "outMessages": idres.rows[0].out_messages,
                        "inMessages": idres.rows[0].in_messages
                    }
                })
            }
        }
    //   return res.send(refresher(id));
    }
    
    const recepient = req.body.recepient;
    const message = req.body.message;
    // console.log(message);d
    let completed = "";
    var sender = await refresher(id);
    const dbres = await client.query(`SELECT * FROM users`);

    for (let user of dbres.rows) {
        if (user.id == id) {
            try{
                console.log(message[0]);
                console.log(message[1]);
                // console.log(JSON.parse(message[1]))
                console.log(message[2]);
                const update = await client.query(`UPDATE messages SET out_messages = array_cat(out_messages, ARRAY['${user.username}', '${message[0]}', 
                '${message[1]}', '${message[2]}','${message[3]}', '${message[4]}', '${message[5]}', '${message[6]}', '${message[7]}', '${message[8]}', 
                '${message[9]}', '${message[10]}', '${message[11]}','${message[12]}', '${message[13]}', '${message[14]}', '${message[15]}',
                '${message[16]}', '${message[17]}', '${message[18]}', '${message[19]}', '${message[20]}', '${message[21]}', '${message[22]}', '${message[23]}', 
                '${message[24]}', '${message[25]}', '${message[26]}', '${message[27]}','${message[28]}', '${message[29]}', '${message[30]}', '${message[31]}', 
                '${message[32]}', '${message[33]}', '${message[34]}', '${message[35]}','${message[36]}', '${message[37]}', '${message[38]}', '${message[39]}', 
                '${message[40]}', '${message[41]}', '${message[42]}', '${message[43]}','${message[44]}', '${message[45]}', '${message[46]}', '${message[47]}',
                '${message[48]}', '${message[49]}', '${message[50]}', '${message[51]}','${message[52]}', '${message[53]}', '${message[54]}', '${message[55]}', 
                '${message[56]}', '${message[57]}', '${message[58]}', '${message[59]}','${message[60]}', '${message[61]}', '${message[62]}', '${message[63]}',
                '${message[64]}', '${message[65]}', '${message[66]}', '${message[67]}','${message[68]}', '${message[69]}', '${message[70]}', '${message[71]}', 
                '${message[72]}', '${message[73]}', '${message[74]}', '${message[75]}','${message[76]}', '${message[77]}', '${message[78]}', '${message[79]}', 
                '${message[80]}', '${message[81]}', '${message[82]}', '${message[83]}','${message[84]}', '${message[85]}', '${message[86]}', '${message[87]}', 
                '${message[88]}', '${message[89]}', '${message[90]}', '${message[91]}']) WHERE user_id = ${user.id};`);
                completed += "comp";
                // console.log(user.messages);
            } catch(e) {
                console.log("SOME KIND OF SQL ERROR") 
                console.log(e.stack);
                return res.status(500).send();
            }
            
        };
    };

    for (let user of dbres.rows) {
        if (user.username === recepient) {
            console.log(sender, "SENDER");
            try{
                const update = await client.query(`UPDATE messages SET in_messages = ARRAY_CAT(in_messages, ARRAY['${sender.username}', '${message[0]}', 
                '${message[1]}', '${message[2]}','${message[3]}', '${message[4]}', '${message[5]}', '${message[6]}', '${message[7]}', '${message[8]}', 
                '${message[9]}', '${message[10]}', '${message[11]}','${message[12]}', '${message[13]}', '${message[14]}', '${message[15]}',
                '${message[16]}', '${message[17]}', '${message[18]}', '${message[19]}', '${message[20]}', '${message[21]}', '${message[22]}', '${message[23]}', 
                '${message[24]}', '${message[25]}', '${message[26]}', '${message[27]}','${message[28]}', '${message[29]}', '${message[30]}', '${message[31]}', 
                '${message[32]}', '${message[33]}', '${message[34]}', '${message[35]}','${message[36]}', '${message[37]}', '${message[38]}', '${message[39]}', 
                '${message[40]}', '${message[41]}', '${message[42]}', '${message[43]}','${message[44]}', '${message[45]}', '${message[46]}', '${message[47]}',
                '${message[48]}', '${message[49]}', '${message[50]}', '${message[51]}','${message[52]}', '${message[53]}', '${message[54]}', '${message[55]}', 
                '${message[56]}', '${message[57]}', '${message[58]}', '${message[59]}','${message[60]}', '${message[61]}', '${message[62]}', '${message[63]}',
                '${message[64]}', '${message[65]}', '${message[66]}', '${message[67]}','${message[68]}', '${message[69]}', '${message[70]}', '${message[71]}', 
                '${message[72]}', '${message[73]}', '${message[74]}', '${message[75]}','${message[76]}', '${message[77]}', '${message[78]}', '${message[79]}', 
                '${message[80]}', '${message[81]}', '${message[82]}', '${message[83]}','${message[84]}', '${message[85]}', '${message[86]}', '${message[87]}', 
                '${message[88]}', '${message[89]}', '${message[90]}', '${message[91]}']) WHERE user_id = ${user.id}`);
                completed += "leted"
            } catch(e) {
                console.log("sender recepient error")
                res.status(500).send();
                return;
            }
            
            console.log(user.messages);
        };
    };

    if (completed === "completed") {
        res.send(JSON.stringify(sender));
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
});

app.get("/cipherkey", (req, res, next) => {
    let key = keyGen.keyGenerator();
    res.send(JSON.stringify(key))
    // console.log(key);  console.log(req.body);
});

app.listen(9000, () => {
    console.log("Listening on port 9000");
    console.log(database);
});