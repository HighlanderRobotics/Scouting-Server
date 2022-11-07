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

// Connect to database and create if doesn't exist
const db = new sqlite.Database('./teams.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err);
  });

//get the port number from .env file
app.listen(port, () => { 
    console.log(`Collection Server running on ${port}...`)
})


// REGISTER A Team
app.post ("/createTeam", async (req,res) => {
    // Get username and hash password
    const teamNumber = req.body.number
    const teamName = req.body.teamName
    const tournaments = req.body.tournaments

    var sql = `SELECT * FROM teams WHERE teamNumber = '${teamNumber}'`
    db.get(sql, (err, teams) => {
        if (err) {
            return console.error(err)
        }

        return teams ? () => {
            // Team exists
            console.log(`${teamNumber}: ${teamName} already exists`);
            res.status(400).send(`${teamNumber}: ${teamName} already exists`)
        } : () => {
            // Team doesn't exist and needs to be added
            sql = `INSERT INTO teams VALUES(?,?,?)`
            db.run(sql, [teamNumber, teamName, tournaments], (err) => {
                if (err)
                    console.error(err);
                }
            )
            console.log(`${teamNumber}: ${teamName} added`);
            res.status(201).send(`Successfully added team`)
        }

    })
})

// List teams
app.get("/listTeams", async (req,res) => {
    var teams = []
    var sql = `SELECT * FROM teams ORDER BY teamnumber`
    db.run(sql, (err, rows) => {
        if (err) {
            return console.error(err)
        }
        rows.forEach(element => {
            teams.push(element)
        });   
    })

    res.status(201).send(teams)
    console.log(teams)
})