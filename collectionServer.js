require("dotenv").config()

// To connect to the database
const sqlite = require("sqlite3").verbose()

// For writing logs
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const Writable = require("stream").Writable

// Promises
const util = require('util')

//this will allow us to pull params from .env file
const express = require('express')

// HTTPS
const port = process.env.PORT 

// Analysis Engine
const TaskManager = require('./TaskManager.js')

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

const promiseWithTimeout = ((promise) => {
    // Times out after 1 ms, assumes promise is still pending (usually takes ~0ms)
    var timeOutTime = 1;

    const timeoutPromise = new Promise(async (resolve, reject) => {
        setTimeout(resolve, timeOutTime, `Requested task is unfinished, come back later`)
    })

    return Promise.race([promise, timeoutPromise])
})

app.post("/getTaskData", async (req,res) => {
    // Get cached/Rerun analysis engine and send it

    if (req.body.taskNumber != undefined && req.body.taskNumber < tasks.size) {
        console.log(`Task Number: ${req.body.taskNumber}`)

        promiseWithTimeout(tasks.get(req.body.taskNumber))
        .then((response) => {
            // console.log(response)
            res.status(200).send(`${JSON.stringify(response)}`)
        })
    } else if (req.body.uuid != undefined && Array.from(uuidToTask.values()).includes(req.body.uuid)) {
        console.log(`UUID: ${req.body.uuid}`)

        promiseWithTimeout(tasks.get(uuidToTask.get(req.body.uuid)))
        .then((response) => {
                res.status(200).send(`${JSON.stringify(response)}`)
        })
    } else {
        res.status(400).send(`Missing task number or uuid or task number/uuid doesn't have a task`)
        return
    }
})

app.post("/analysis", async (req, res) => {
    // Run analysis engine
    if (req.body.uuid) {
        if (req.body.tasks) {
            uuidToTask.set(req.body.uuid, uuidToTask.size)
            tasks.set(uuidToTask.size, new TaskManager().runTasks(req.body.tasks))

            res.status(200).send(`Task Number: ${uuidToTask.size}`)
        } else {
            res.status(400).send(`Missing tasks`)
        }
    } else {
        res.status(400).send(`Missing uuid`)
    }
})

// Add data to database
app.post("/addScoutReport", async (req, res) => {

    if (req.body.uuid) {
        if (req.body.teamKey && req.body.tournamentKey && req.body.data) {
            uuidToTask.set(req.body.uuid, uuidToTask.size)
            tasks.set(uuidToTask.size, Manager.addScoutReport(req.body.teamKey, req.body.tournamentKey, req.body.data))

            res.status(200).send(`Task Number: ${uuidToTask.size}`)
        } else {
            res.status(400).send(`Missing something`)
        }
    } else {
        res.status(400).send(`Missing uuid`)
    }

    
})

// Add tournament
app.post("/addTournamentMatches", async (req, res) => {
    // If the proper fields are filled out
    if (req.body.tournamentName && req.body.tournamentDate && req.body.uuid) {
        uuidToTask.set(req.body.uuid, uuidToTask.size)
        tasks.set(uuidToTask.size, Manager.addMatches(req.body.tournamentName, req.body.tournamentDate))
        // console.log(tasks.get(uuidToTask.size))
        
        res.status(200).send(`${JSON.stringify({"taskNumber": uuidToTask.size})}`)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// List teams
app.post("/listTeams", async (req,res) => {

    if (req.body.uuid) {
        uuidToTask.set(req.body.uuid, uuidToTask.size)
        tasks.set(uuidToTask.size, Manager.getTeams())
        // console.log(tasks.get(uuidToTask.size))
        res.status(200).send(`${JSON.stringify({"taskNumber": uuidToTask.size})}`)
    } else {
        res.status(400).send(`Missing uuid`)
    }

})

// Reset DB (testing only)
app.post("/resetDB", async (req,res) => {

    if (req.body.uuid) {
        uuidToTask.set(req.body.uuid, uuidToTask.size)
        tasks.set(uuidToTask.size, Manager.resetAndPopulateDB())
        res.status(200).send(`${JSON.stringify({"taskNumber": uuidToTask.size})}`)
    } else {
        res.status(400).send(`Missing uuid`)
    }
})