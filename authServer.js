require("dotenv").config()

// To connect to the database
const sqlite = require("sqlite3").verbose()
// const axios = require("axios")

//this will allow us to pull params from .env file
const express = require('express')
const app = express()
app.use(express.json())

//This middleware will allow us to pull req.body.<params>
const port = process.env.TOKEN_SERVER_PORT 

// Connect to database
const db = new sqlite.Database('./users.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});

//get the port number from .env file
app.listen(port, () => { 
    console.log(`Authorization Server running on ${port}...`)
})

const bcrypt = require ('bcrypt')
const users = []

// REGISTER A USER
app.post ("/createUser", async (req,res) => {
    // Get username and hash password
    const user = req.body.name
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    var sql = `SELECT * FROM users WHERE username = '${user}'`
    db.get(sql, [user], (err) => {
        if (err) {
            sql = `INSERT INTO users VALUES(?,?,?)`;
            db.run(sql, [user, hashedPassword, generateAccessToken()]);
        } else {
          console.log(`User already exists`);
        }
        return;
      });
})

// REGISTER A USER
app.get("/listUser", async (req,res) => {
    res.status(201).send(users)
    console.log(users)
})

const jwt = require("jsonwebtoken")
const e = require("express")

//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
app.post("/login", async (req,res) => {
    const user = users.find( (c) => c.user == req.body.name)
    

    //check to see if the user exists in the list of registered users
    if (user == null) {
        res.status(404).send ("User does not exist!")
    }
    //if user does not exist, send a 400 response
    else if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken ({user: req.body.name})
        const refreshToken = generateRefreshToken ({user: req.body.name})        

        var sql = `UPDATE users
                    SET access token = ?
                    WHERE username = ?`
        db.run(sql, [accessToken, user], function(err) {
            if (err) {
                return console.error(err.message)
            }
            console.log(`Row(s) updated: ${this.changes}`)
        })

        res.json ({accessToken: accessToken, refreshToken: refreshToken})
    } 
    else {
        res.status(401).send("Password Incorrect!")
    }
})

// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
}

// refreshTokens
let refreshTokens = []

function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return refreshToken;
}

// REFRESH TOKEN API
app.post("/refreshToken", (req, res) => {
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400).send("Refresh Token Invalid")
    }

    // Removes old refreshTokens
    refreshTokens = refreshTokens.filter( (c) => c != req.body.token)

    // Generate new accessToken and refreshTokens
    const accessToken = generateAccessToken({user: req.body.name})
    const refreshToken = generateRefreshToken({user: req.body.name})

    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

// Remove refreshToken on logout
app.delete("/logout", (req, res) => {
    // console.log(res.body.token)
    // console.log(refreshTokens)
    refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
    // console.log(refreshTokens)

    res.status(204).send("Logged out!")
})