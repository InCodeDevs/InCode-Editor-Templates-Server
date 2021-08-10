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

app.get("/api/upload/*", (req, res) => {
    let p = url.parse(req.url);
    let args = p.pathname.split("/");
    if (args.length >= 5) {
        let name = Buffer.from(args[3], 'base64').toString()
        console.log(name + "\n" + args[3])
        let code = "";
        for (let i = 4; i < args.length; i++) {
            code += args[i] + "/";
        }
        if (fs.existsSync(path.join(__dirname, '../public', 'templates/', name + '.ic'))) {
            res.status(501)
            res.send("Already Exists")
        } else {
            fs.writeFileSync(path.join(__dirname, '../public', 'templates/', name + '.ic'), code);
            res.status(200);
            res.send("Successful")
        }
    } else {
        res.status(501)
        res.send("Invalid URL")
    }
})

app.use("/", express.static(path.join(__dirname, '../public')))

app.use("/", serverIndex(path.join(__dirname, '../public'), {
    icons: true
}))

app.listen(process.env.PORT)
