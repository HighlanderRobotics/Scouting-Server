require("dotenv").config()

// To connect to the database
const sqlite = require("sqlite3").verbose()
// const axios = require("axios")

// For writing logs
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const Writable = require("stream").Writable

// Promises
const util = require('util')

//this will allow us to pull params from .env file
const express = require('express')
const app = express()
app.use(express.json())

var logStream = fs.createWriteStream(path.join(`${__dirname}/logs`, `Logs_${new Date()}.log`), { flags: 'a' })

// setup the logger
app.use(morgan('combined', {
    stream: logStream
}))

class MyStream extends Writable {
    write(line) {
        // Write to console
        console.log("Logger - ", line)
    }
}

// Create a new named format
morgan.token("readable", ":status A new :method request from :remote-addr for :url was received. It took :total-time[2] milliseconds to be resolved")

let writer = new MyStream()

// Use the new format by name
app.use(morgan('readable', {
    stream: writer
}))

//This middleware will allow us to pull req.body.<params>
const port = process.env.TOKEN_SERVER_PORT 

const Manager = require('./dbmanager.js')
const { rejects } = require("assert")

//get the port number from .env file
app.listen(port, () => { 
    console.log(`Collection Server running on ${port}...`)
    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on
    Manager.initServer()
    console.log(`Initializing server`)
})


app.get("/getDashboardData", async (req,res) => {
    // Get cached/Rerun analysis engine and send it
    res.status(200).send(`Analysis engine data here`)
})

app.get("/runEngine", async (req, res) => {
    // Run analysis engine
    res.status(201).send(`Started analysis`)
})

// Add data to database
app.post("/addData", async (req, res) => {
    if (req.body.teamKey && req.body.tournamentKey && req.body.data) {
        // Manager.addData(req.body.teamKey, req.body.tournamentKey, req.body.data)
        res.status(202).send(`Looks good`)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// Add tournament
app.post("/addTournamentMatches", async (req, res) => {
    // If the proper fields are filled out
    if (req.body.tournamentName && req.body.tournamentDate) {
        Manager.addMatches(req.body.tournamentName, req.body.tournamentDate)
        res.status(202).send(`Looks good`)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// List teams
app.get("/listTeams", async (req,res) => {

    const teams = (cb) => {
        Manager.getTeams()
        .then((response) => {
            cb(response)
        })
        .catch((err) => {
            cb(err)
        })
    }

    teams((response) => {
        res.status(201).send(response)
    })
})