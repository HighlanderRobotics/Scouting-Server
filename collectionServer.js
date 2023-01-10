require('dotenv').config()

const axios = require("axios")

// To connect to the database
const sqlite = require('sqlite3').verbose()

// For writing logs
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const Writable = require('stream').Writable

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

// Terminal QR Code
var qrcode = require('qrcode-terminal')

// ngrok
// Get constant url from paid ngrok
let url = undefined


setup = async () => {

    try {
        url = await axios.get('http://localhost:4040/api/tunnels')
        .then((res) => {
            // console.log(res.data.tunnels[0])
            return res.data.tunnels[0].public_url
        })
        console.log(url)
        
        if (url.startsWith('https://')) {
            const https = 'https://'
            return url.slice(https.length)
        }
    
        if (url.startsWith('http://')) {
            const http = 'http://'
            return url.slice(http.length)
        }
    } catch (e) {
        console.log(`\nngrok link is not setup/running\n`)
    }


    

    return url
}

// Logging stuff
var logStream = fs.createWriteStream(path.join(`${__dirname}/logs`, `Logs_${new Date()}.log`), { flags: 'a' })

// setup the logger
app.use(morgan('combined', {
    stream: logStream
}))

class MyStream extends Writable {
    write(line) {
        // Write to console
        console.log('Logger - ', line)
    }
}

// Create a new named format
morgan.token('readable', ':status A new :method request from :remote-addr for :url was received. It took :total-time[2] milliseconds to be resolved')

let writer = new MyStream()

// Use the new format by name
app.use(morgan('readable', {
    stream: writer
}))

// Temporary if others want to use old endpoints for integration test day, will force changing endpoints later
const Manager = require('./manager/dbmanager.js')
const { json } = require('body-parser')

// Tasks map
const uuidToTask = new Map()
const tasks = new Map()

app.listen(port, async () => { 
    console.log(`Collection Server running on ${port}...`)

    // Scannable qr code with ngrok link
    if (await setup()) {
        qrcode.generate(url)
    }

    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on
    await new DatabaseManager().runTask('initServer', {})
    .then((results) => {
        if (results) {
            console.log(results)
        } else {
            console.log(`Initializing server`)
        }
    })
})

app.get('/', async (req, res) => {
    res.status(200).send(`All good my dude`)
})

// Manager
app.post('/API/manager/:task', async (req, res) => {
    if (req.params.task) {
        await new DatabaseManager().runTask(req.params.task, req.body)
            .then((result) => {
                res.status(200).send(result)
            })
            .catch((err) => {
                console.log(`Detected error`)
                if (err.customCode) {
                    res.status(err.customCode).send(err)
                } else {
                    res.status(400).send(err)
                }
            })
    } else {
        res.status(404).send(`Missing Task Name`)
    }
})

app.get('/API/manager/:task', async (req, res) => {
    if (req.params.task) {
        await new DatabaseManager().runTask(req.params.task, req.query)
            .then((result) => {
                res.status(200).send(result)
            })
            .catch((err) => {
                console.log(`Detected error`)
                if (err.customCode) {
                    res.status(err.customCode).send(err)
                } else {
                    res.status(400).send(err)
                }
            })
    } else {
        res.status(404).send(`Missing Task Name`)
    }
})

// Analysis
app.post('/API/analysis', async (req, res) => {
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

app.get('/API/analysis/:task', async (req, res) => {
    // Run analysis engine
    if (req.query) {
        singleTask = [
            {
                'name': req.params.task,
            }
        ]
        Object.keys(req.query).forEach((key) => {
            singleTask[0][`${key}`] = req.query[key]
        })

        let results = await new TaskManager().runTasks(singleTask)

        // console.log(`Results: ${JSON.stringify(results)}`)
        res.status(200).send(results)
    } else {
        res.status(400).send(`Missing tasks`)
    }
})

// Reset DB (testing only)
app.post('/resetDB', async (req,res) => {
    if (req.body.uuid) {
        let taskNumber = uuidToTask.size
        uuidToTask.set(req.body.uuid, taskNumber)
        tasks.set(taskNumber, Manager.resetAndPopulateDB())
        res.status(200).send(`${JSON.stringify({'taskNumber': taskNumber})}`)
    } else {
        res.status(400).send(`Missing uuid`)
    }
})

// Old system
const promiseWithTimeout = ((promise) => {
    // Times out after 1 ms, assumes promise is still pending (usually takes ~0ms)
    var timeOutTime = 1

    const timeoutPromise = new Promise(async (resolve, reject) => {
        setTimeout(resolve, timeOutTime, `Requested task is unfinished, come back later`)
    })

    return Promise.race([promise, timeoutPromise])
})

app.get('/getTaskData', async (req,res) => {
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
