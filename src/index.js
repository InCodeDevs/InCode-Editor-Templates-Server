/**
 * @author Ben Siebert
 * @copyright 2018-2021 Ben Siebert. All rights reserved.
 */

require('dotenv').config();


const express = require('express');
const serverIndex = require('serve-index')
const url = require('url')
const path = require('path');
const atob = require('atob')
const fs = require('fs');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.post("/api/upload", (req, res) => {
    let o = req.body;
    let name = o.name
    let code = o.code;
    if (fs.existsSync(path.join(__dirname, '../public', 'templates/', name + '.ic'))) {
        res.status(501)
        res.send("Already Exists")
    } else {
        fs.writeFileSync(path.join(__dirname, '../public', 'templates/', name + '.ic'), code);
        let j = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/templates.json')).toString());
        j[name] = {
            verified: false,
            directURL: "/templates/" + name + ".ic",
            uploaded: new Date()
        }
        fs.writeFileSync(path.join(__dirname, '../public/templates.json'), JSON.stringify(j))
        res.status(200);
        res.send("Successful")
    }
})

app.get("/", (res) => {
    res.charset = "utf-8"
})

app.use("/", express.static(path.join(__dirname, '../public')))

app.use("/", serverIndex(path.join(__dirname, '../public'), {
    icons: true
}))

app.listen(process.env.PORT, "0.0.0.0")
