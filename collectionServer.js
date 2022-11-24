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

// Tasks map
const uuidToTask = new Map()
const tasks = new Map()

app.listen(port, () => { 
    console.log(`Collection Server running on ${port}...`)
    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on
    Manager.initServer()
    console.log(`Initializing server`)
})

app.get("/", async (req, res) => {
    res.status(200).send(`All good my dude`)
})

app.post("/getTaskData", async (req,res) => {
    // Get cached/Rerun analysis engine and send it
    
    if (req.body.taskNumber != undefined) {
        console.log(`Task Number: ${req.body.taskNumber}`)
        // Times out after 50 ms, assumes it's still pending (usually takes ~10ms)
        setTimeout(function() {
            if (tasks.has(req.body.taskNumber)) {
                tasks.get(req.body.taskNumber)
                .catch((err) => {
                    console.error(err)
                })
                .then((returnData) => {
                    res.status(200).send(`${JSON.stringify(returnData)}`)
                })
            } else {
                res.status(400).send(`Task number does not exist`)
            }
        }, 50)
    } else if (req.body.uuid) {
        console.log(`UUID: ${req.body.uuid}`)
        console.log(tasks.get(uuidToTask.get(req.body.uuid)))
        res.status(200).send(`${tasks.get(uuidToTask.get(req.body.uuid))}`)
    } else {
        res.status(400).send(`Missing task number or uuid`)
    }
})

app.post("/runEngine", async (req, res) => {
    // Run analysis engine
    res.status(200).send(`Started analysis`)
})

// Add data to database
app.post("/addScoutReport", async (req, res) => {
    if (req.body.teamKey && req.body.tournamentKey && req.body.data) {
        Manager.enterData(req.body.teamKey, req.body.tournamentKey, req.body.data)
        res.status(200).send(`Looks good`)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// Add tournament
app.post("/addTournamentMatches", async (req, res) => {
    // If the proper fields are filled out
    if (req.body.tournamentName && req.body.tournamentDate && req.body.uuid) {
        var taskNumber = uuidToTask.size
        uuidToTask.set(req.body.uuid, taskNumber)
        tasks.set(taskNumber, Manager.addMatches(req.body.tournamentName, req.body.tournamentDate))
        console.log(tasks.get(taskNumber))
        res.status(200).send(`${taskNumber}`)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// List teams
app.post("/listTeams", async (req,res) => {

    if (req.body.uuid) {
        var taskNumber = uuidToTask.size
        uuidToTask.set(req.body.uuid, taskNumber)
        tasks.set(taskNumber, Manager.getTeams())
        // console.log(tasks.get(taskNumber))
        res.status(200).send(`Task Number: ${taskNumber}`)
    } else {
        res.status(400).send(`Missing uuid`)
    }

})

