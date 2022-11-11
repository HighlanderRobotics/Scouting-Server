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

app.get("/getDashboardStartupData", async (req,res) => {
    // Run cassie's analysis data and save it to an object
    res.status(201).send(`Cassie's analysis data here`)
})

app.get("/getDashboardUpdatedData", async (req,res) => {
    // Rerun Cassie's analysis engine and send it
    res.status(201).send(`Cassie's analysis data here`)
})




// REGISTER A Team
app.put("/createTeam", async (req,res) => {
    console.log(`Recieved createTeam post request`)
    // Get username and hash password
    const teamNumber = req.body.number
    const teamName = req.body.teamName
    const tournaments = []
    console.log(`Got values`)


    var sql = `SELECT * FROM teams WHERE teamNumber = '${teamNumber}'`
    db.get(sql, (err, teams) => {
        console.log(`Queried Database`)
        if (err) {
            return console.error(err)
        }
        console.log(`Team: ${teams}`)
        console.log(`${teams == undefined}`)

        if (teams == undefined) {
            // Team doesn't exist and needs to be added
            console.log(`Team needs to be added`)
            sql = `INSERT INTO teams VALUES(?,?,?)`
            db.run(sql, [teamNumber, teamName, JSON.stringify(tournaments)], (err) => {
                if (err)
                    console.error(err);
                }
            )
            console.log(`${teamNumber}: ${teamName} added`)
            res.status(201).send(`Successfully added team`)
        } else {
            // Team exists
            console.log(`${teamNumber}: ${teamName} already exists`);
            res.status(400).send(`${teamNumber}: ${teamName} already exists`)
        }

        return
    })
})

// Add tournament
app.post("/addTournament", async (req, res) => {
    const teamNumber = req.body.teamNumber
    const tournament = {
        'name': req.body.tournamentName,
        'epoch': req.body.tournamentEpoch 
    }
    console.log(`Got Data: ${teamNumber} ${tournament.name}`)
    var sql = `SELECT * FROM teams WHERE teamNumber = ${teamNumber}`
    db.get(sql, (err, team) => {
        console.log(`Got Team: ${team.teamNumber}`)
        if (err) {
            console.error(err)
        }

        if (team == undefined) {
            console.log(`Could not find team ${teamNumber}`)
            res.status(400).send(`Team ${teamNumber} does not exist in the database`)
        } else {
            var tournaments = []
            tournaments = JSON.parse(team.tournaments)
            console.log(`Tournaments ${tournaments}`)
            if (!containsSameTournament(tournament, tournaments)) {
                console.log(`Tournament does not have ${tournament.name}`)
                tournaments.push(tournament)
                console.log(`Have updated tournaments: ${JSON.stringify(tournaments)}`)
                sql = `
                    UPDATE teams 
                    SET tournaments = ? 
                    WHERE teamNumber = ?`
                db.run(sql, [JSON.stringify(tournaments), teamNumber], (err) => {
                    if (err) {
                        console.error(err)
                    }
                })

                res.status(400).send(`Tournament ${tournament.name} successfully added`)
            } else {
                console.log(`Tournament ${tournament.name} already exists`)
                res.status(400).send(`Tournament ${tournament.name} already exists`)
            }
        }
        return
    })
})

app.put("/addMatch", async (req, res) => {
    // Organize incoming data
    const tournament = {
        'name': req.body.tournament.tournamentName,
        'epoch': req.body.tournamentEpoch 
    }
    const matchHeader = {
        'UUID': req.body.header.uuid,
        'matchNumber': req.body.header.matchNumber,
        'teamNumber': req.body.header.teamNumber,
        'scouterName': req.body.header.scouterName,
        'startTime': req.body.header.startTime
    }
    const matchData = {
        'challenge': req.body.data.challenge,
        'defense': req.body.data.defense,
        'nodes': req.body.data.notes,
        'events': req.body.data.events
    }

    // Create a table and write this to the table
})

// List teams
app.get("/listTeams", async (req,res) => {
    var sql = `SELECT * FROM teams ORDER BY teamnumber`
    db.all(sql, (err, storedTeams) => {
        if (err) {
            return console.error(err)
        }
        console.log(storedTeams)
        res.status(201).send(storedTeams)
    })
    return
})

function containsSameTournament(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === obj.name && list[i].epoch === obj.epoch) {
            console.log(`Tournaments are the same: ${list[i]} ${obj}`)
            return true
        }
    }
    return false
}