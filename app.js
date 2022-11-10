const sqlite = require("sqlite3").verbose()
const http = require('http');
const axios = require("axios")

// Connect to db
const db = new sqlite.Database('./teams.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});

function getData() {
    
}

// Keys (i.e. teamKey) are from api, used to pull information about a team

function recreateTable() {
    var teamsTable = `CREATE TABLE teams(
        teamNumber INTEGER PRIMARY KEY, 
        teamName TEXT ONLY,
        teamKey TEXT ONLY
    )`
    
    var tournamentTable = `CREATE TABLE tournaments(
        tournamentId INTEGER PRIMARY KEY,
        tournamentName TEXT ONLY VARCHAR(20),
        tournamentDate INTEGER,
        tournamentLocation TEXT ONLY VARCHAR(50),
        tournamentKey TEXT ONLY,
        tournamentCode TEXT ONLY
    )`

    // Needs forign keys fixed to avoid adding matches that don't exist
    var matchesTable = `CREATE TABLE matches(
        id INTEGER PRIMARY KEY,
        tournamentId INTEGER NOT NULL,
        matchNumber INTEGER NOT NULL,
        teamNumber INTEGER NOT NULL,
        UNIQUE (tournamentId, matchNumber, teamNumber),
        FOREIGN KEY (tournamentId) REFERENCES tournaments(tournamentId),
        FOREIGN KEY (teamNumber) REFERENCES teams(teamNumber)
    )`

    var dataTable = `CREATE TABLE data(
        id INTEGER PRIMARY KEY,
        matchId INTEGER NOT NULL,
        data VARCHAR(5000),
        FOREIGN KEY (matchId) REFERENCES matches(id)
    )`
    
    var url = "https://www.thebluealliance.com/api/v3"
    // Get teams from api after figuring out how many pages of teams there are (probably around 16 because 8033/500)
    // JSON teams = http get request to url + /teams/page number
    // Add to the insertTeams
    var insertTeams = `INSERT INTO teams(teamNumber, teamName, teamKey) VALUES 
        ${formattedTeamData}
    `

    // Get events/tournaments from api
    // JSON events = http get request and save event key
    var insertTournaments = `INSERT INTO tournaments(tournamentName, tournamentDate, tournamentLocation, tournamentKey, tournamentCode) VALUES
        ${formattedTournamentData}
    `

    // Getting simple data from this should be good enough because all thats needed is the team number
    var tournamentKey = formattedTeamData.getthekeysomehow("Chezy Champs", 2022)
    // Get teams from /event/{event_key}/teams/simple
    // Get matches from /event/{event_key}/matches/simple
    var insertMatches = `INSERT INTO matches(tournamentID, matchNumber, teamNumber) VALUES
        ${formattedMatches}
    `
    var insertSampleData = `INSERT INTO data(matchId, data) VALUES 
        (1, "{Bruh}")
        (2, "{Sample data}")
        (3, "{more data}")
        (23, "{pizza time}")
    `

    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS teams`)
        db.run(`DROP TABLE IF EXISTS tournaments`)
        db.run(`DROP TABLE IF EXISTS matches`)
        db.run(`DROP TABLE IF EXISTS data`)
        db.run(teamsTable)
        db.run(tournamentTable)
        db.run(matchesTable)
        db.run(dataTable)
    })
}

recreateTable()