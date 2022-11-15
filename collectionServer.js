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

// HTTPS (code was removed)
const port = process.env.TOKEN_SERVER_PORT 

const app = express()
app.use(express.json())

// Logging stuff
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

const Manager = require('./dbmanager.js')

//get the port number from .env file


app.listen(port, () => { 
    console.log(`Collection Server running on ${port}...`)
    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on
    Manager.initServer()
    console.log(`Resetting server`)
})

app.get("/", async (req, res) => {
    res.status(200).send(`All good my dude`)
})

app.get("/getDashboardStartupData", async (req,res) => {
    // Run cassie's analysis data and save it to an object
    res.status(200).send(`Analysis engine data here`)
})

app.get("/getDashboardUpdatedData", async (req,res) => {
    // Get cached/Rerun analysis engine and send it
    res.status(200).send(`Analysis engine data here`)
})

app.get("/forceRunEngine", async (req, res) => {
    // Run analysis engine
    res.status(200).send(`Analysis engine data here`)
})

// Add data to database
app.post("/addScoutReport", async (req, res) => {
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

