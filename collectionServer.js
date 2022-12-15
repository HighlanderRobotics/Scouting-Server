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

// Task Managers
const TaskManager = require('./TaskManager.js')
const DatabaseManager = require('./DatabaseManager.js')

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

// Temporary if others want to use old endpoints for integration test day, will force changing endpoints later
const Manager = require('./manager/dbmanager.js')

// Tasks map
const uuidToTask = new Map()
const tasks = new Map()

app.listen(port, async () => { 
    console.log(`Collection Server running on ${port}...`)
    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on
    let init = await new DatabaseManager().runTask("InitServer", {})
    .catch((err) => {
        if (err) {
            console.log(err)
        }
    })
    .then((results) => {
        console.log(`Initializing server`)
    })
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

app.get("/getTaskData", async (req,res) => {
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

app.get("/analysis", async (req, res) => {
    // Run analysis engine
    if (req.body.uuid) {
        if (req.body.tasks) {
            let taskNumber = uuidToTask.size
            uuidToTask.set(req.body.uuid, taskNumber)
            tasks.set(taskNumber, new TaskManager().runTasks(req.body.tasks))

            res.status(200).send(`Task Number: ${taskNumber}`)
        } else {
            res.status(400).send(`Missing tasks`)
        }
    } else {
        res.status(400).send(`Missing uuid`)
    }
})

app.get("/API/analysis", async (req, res) => {
    // Run analysis engine
    if (req.body.tasks) {
        let results = await new TaskManager().runTasks(req.body.tasks)

        // console.log(`Results: ${JSON.stringify(results)}`)
        res.status(200).send(results)
    } else {
        res.status(400).send(`Missing tasks`)
    }
})

app.get("/API/manager/:task", async (req, res) => {
    if (req.params.task) {
        let results = await new DatabaseManager().runTask(req.params.task, req.body)
        .catch((err) => {
            if (err) {
                res.status(400).send(err)
            }
        })

        // console.log(results)
        res.status(200).send(results)
    } else {
        res.status(400).send(`Missing Task Name`)
    }
})

// Add data to database
app.post("/addScoutReport", async (req, res) => {

    if (req.body.uuid) {
        if (req.body.teamKey && req.body.tournamentKey && req.body.data) {
            let taskNumber = uuidToTask.size
            uuidToTask.set(req.body.uuid, taskNumber)
            tasks.set(taskNumber, Manager.addScoutReport(req.body.teamKey, req.body.tournamentKey, req.body.data))

            res.status(200).send(`Task Number: ${taskNumber}`)
        } else {
            res.status(400).send(`Missing something`)
        }
    } else {
        res.status(400).send(`Missing uuid`)
    }  
})

app.post("/API/addScoutReport", async (req, res) => {

    if (req.body.teamKey && req.body.tournamentKey && req.body.data) {
        let results = await Manager.addScoutReport(req.body.teamKey, req.body.tournamentKey, req.body.data)

        res.status(200).send(results)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// Add tournament
app.post("/addTournamentMatches", async (req, res) => {
    // If the proper fields are filled out
    if (req.body.tournamentName && req.body.tournamentDate && req.body.uuid) {
        let taskNumber = uuidToTask.size
        uuidToTask.set(req.body.uuid, taskNumber)
        tasks.set(taskNumber, Manager.addMatches(req.body.tournamentName, req.body.tournamentDate))
        // console.log(tasks.get(taskNumber))
        
        res.status(200).send(`${JSON.stringify({"taskNumber": taskNumber})}`)
    } else {
        res.status(400).send(`Missing something`)
    }
})

app.post("/API/addTournamentMatches", async (req, res) => {
    // If the proper fields are filled out
    if (req.body.tournamentName && req.body.tournamentDate) {
        var results = await Manager.addMatches(req.body.tournamentName, req.body.tournamentDate)
        .catch((err) => {
            if (err) {
                res.status(400).send(`Error with addTournamentMatches(): ${err}`)
            }
        })
        res.status(200).send(results)
    } else {
        res.status(400).send(`Missing something`)
    }
})

// List teams
app.get("/listTeams", async (req,res) => {

    if (req.body.uuid) {
        let taskNumber = uuidToTask.size
        uuidToTask.set(req.body.uuid, taskNumber)
        tasks.set(taskNumber, Manager.getTeams())
        // console.log(tasks.get(taskNumber))
        res.status(200).send(`${JSON.stringify({"taskNumber": taskNumber})}`)
    } else {
        res.status(400).send(`Missing uuid`)
    }

})

app.get("/API/listTeams", async (req,res) => {

    var results = await Manager.getTeams()
    .catch((err) => {
        if (err) {
            res.status(400).send(`Error with getTeams(): ${err}`)
        }
    })

    res.status(200).send(results)
})



// Reset DB (testing only)
app.post("/resetDB", async (req,res) => {

    if (req.body.uuid) {
        let taskNumber = uuidToTask.size
        uuidToTask.set(req.body.uuid, taskNumber)
        tasks.set(taskNumber, Manager.resetAndPopulateDB())
        res.status(200).send(`${JSON.stringify({"taskNumber": taskNumber})}`)
    } else {
        res.status(400).send(`Missing uuid`)
    }
})