require("dotenv").config()

// To connect to the database
const sqlite = require("sqlite3").verbose()
// const axios = require("axios")

// Promises
const util = require('util')

//this will allow us to pull params from .env file
const express = require('express')
const app = express()
app.use(express.json())

//This middleware will allow us to pull req.body.<params>
const port = process.env.TOKEN_SERVER_PORT 

// Connect to database and create if doesn't exist
const db = new sqlite.Database('./test.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err);
  });

const Manager = require('./dbmanager.js')
const { rejects } = require("assert")
let manager = new Manager()

//get the port number from .env file
app.listen(port, () => { 
    console.log(`Collection Server running on ${port}...`)
    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on
    Manager.initServer()
    
})

app.get("/getDashboardStartupData", async (req,res) => {
    // Run cassie's analysis data and save it to an object
    res.status(201).send(`Analysis engine data here`)
})

app.get("/getDashboardUpdatedData", async (req,res) => {
    // Get cached/Rerun analysis engine and send it
    res.status(201).send(`Analysis engine data here`)
})

app.get("/forceRunEngine", async (req, res) => {
    // Run analysis engine
    res.status(201).send(`Analysis engine data here`)
})

// Add tournament
app.post("/addTournamentMatches", async (req, res) => {
    const tournament = {
        'name': req.body.tournamentName,
        'date': req.body.tournamentDate, 
    }

    const loadMatches = (name, date, cb) => {
        Manager.addMatches(name, date)
         .then((errors) => cb(errors))
    }
    
    loadMatches("Chezy Champs", "2022-09-23", (response) => {
        if (response.includes(`(Your Fault)`) || response.includes(`(Ask Barry)`)) {
            res.status(400).send(response)
        } else {
            res.status(201).send(response)
        }
    })
    // Pull tournaments from that year and match data from api and add it to the db
})

// List teams
app.get("/listTeams", async (req,res) => {
    res.status(201).send(Manager.getTeams())
    return
})