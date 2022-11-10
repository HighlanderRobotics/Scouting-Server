const sqlite = require("sqlite3").verbose()
const axios = require("axios")
require("dotenv").config()

// Connect to db
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});

// Pulls match data
function getMatchData(gId, mId) {
    var sql = `SELECT matches.matchId, games.name, matches.teamNumber, teams.teamName, data.data 
        FROM matches
        JOIN teams ON matches.teamNumber  = teams.teamNumber 
        JOIN data ON matches.id  = data.mId 
        JOIN games ON matches.gameId  = games.gameId 
        WHERE matches.gameId = ? and matches.matchId = ?
    `

    db.each(sql, [gId, mId], (err, row) => {
        if (err) {
            throw err;
        }
        console.log(`${row.matchId} ${row.name} ${row.teamNumber} ${row.teamName}\tPoints Scored: ${JSON.parse(row.data).points}`);
    });
}

// Sample for how the analysis engine might work
function getTeamAverage(number) {
    var sql = `SELECT matches.matchId, matches.teamNumber, teams.teamName, data.data 
        FROM matches
        JOIN teams ON matches.teamNumber = teams.teamNumber 
        JOIN data ON matches.id = data.mId 
        WHERE matches.teamNumber = ${number} and teams.teamNumber = ${number}
    `

    db.all(sql, (err, response) => {
        if (err) {
            throw err;
        }
        var total = 0
        for (var i = 0; i < response.length; i++) {
            // console.log(`Response: ${response[i].data}`)
            console.log(JSON.parse(response[i].data).points)
            total += JSON.parse(response[i].data).points
        }

        console.log(`Average score: ${total/response.length}`)
    })
}

function recreateTable() {

    var createTeams = `
        CREATE TABLE teams(
            teamNumber INTEGER PRIMARY KEY, 
            teamName TEXT ONLY,
            teamKey TEXT ONLY
        );`

    var createGames = `
        CREATE TABLE games (
            gameId INTEGER PRIMARY KEY, 
            name VARCHAR(20), 
            location VARCHAR(50),
            date INTEGER,
            key TEXT ONLY VARCHAR(20)
        );`

    var createMatches = `
        CREATE TABLE matches (
            id INTEGER PRIMARY KEY, 
            gameId INTEGER NOT NULL,
            matchId INTEGER KEY,
            teamNumber TEXT ONLY NOT NULL,
            key TEXT ONLY VARCHAR(20),
            UNIQUE (matchId, gameId, teamNumber),
            FOREIGN KEY(gameId) REFERENCES games(gameId),
            FOREIGN KEY(teamNumber) REFERENCES teams(teamNumber)
            );        
            `

    var createData = `
    CREATE TABLE data (
        id INTEGER PRIMARY KEY, 
        mId INTEGER NOT NULL,
        data VARCHAR(3000),
        FOREIGN KEY(mId) REFERENCES matches(id)
    );        
    `
    
    var insertTeams = `
        INSERT INTO teams (teamNumber, teamName) VALUES
        (254, "The Cheesy Poofs"),
        (468, "Aftershock"),
        (487, "Spartans"),
        (976, "Circuit Breakerz"),
        (991, "BroncoBots"),
        (1678, "Citrus Circuits"),
        (2017, "Trojans"),
        (2023, "Robotic Dragons"),        
        (8033, "Highlander Robotics");
    `
    var insertGames = `
        INSERT INTO games (name, location, date) VALUES
        ("chezy", "San Jose", DATE('2022-09-24')),
        ("worlds", "Houston", DATE('2022-04-20'));
    `

    // Inserting sample chezy matches
    var insertMatches = `
        INSERT INTO matches (gameId, matchId, teamNumber) VALUES
        (28, 12, 254),
        (28, 12, 8033),
        (28, 12, 976),
        (28, 13, 8033),
        (28, 14, 8033),
        (28, 15, 8033),
        (28, 16, 8033),
        (28, 42, 1678),
        (28, 42, 487),
        (28, 42, 991),
        (28, 42, 2017),
        (28, 27, 254),
        (28, 27, 8033),
        (28, 27, 1678),
        (28, 27, 3251);
        (28, 27, 2017);
        `

    var insertData = `
        INSERT INTO data (mId, data) VALUES
        (2, '{
            "points": 12
        }'),
        (4, '{
            "points": 16
        }'),
        (5, '{
            "points": 13
        }'),
        (6, '{
            "points": 19
        }'),
        (7, '{
            "points": 24
        }'),
        (8, '{
            "points": 16
        }'),
        (9, '{
            "points": 13
        }'),
        (10, '{
            "points": 25
        }'),
        (11, '{
            "points": 12
        }'),
        (13, '{
            "points": 10
        }')
        `

    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS `scores`")

        db.run("DROP TABLE IF EXISTS `teams`")
        db.run(createTeams)
        db.run("DROP TABLE IF EXISTS `games`")
        db.run(createGames)

        db.run("DROP TABLE IF EXISTS `matches`")
        db.run(createMatches)

        db.run("DROP TABLE IF EXISTS `data`")
        db.run(createData)

        // db.run(insertTeams)
        // db.run(insertGames)
        db.run(insertMatches)
        db.run(insertData)

        // Sample data
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [254, "The Cheesy Poofs", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [8033, "Highlander Robotics", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [1678, "Citrus Circuits", "[]"])
    })
}

function addAPITeams() {
    var url = "https://www.thebluealliance.com/api/v3"
    
    var sql = `INSERT INTO teams (teamNumber, teamName, teamKey) VALUES (?, ?, ?)`

    for (var j = 0; j < 1; j++) {
        axios.get(`${url}/teams/${j}/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
          .then(response => {
            // var data = JSON.parse(response)
            for (var i = 0; i < response.data.length; i++) {
              db.run(sql, [response.data[i].team_number, response.data[i].nickname, response.data[i].key])
              // console.log(response.data[i].key);
            }
            
            
        })
          .catch(error => {
            console.log(error);
          });
        console.log(`Logged page ${j}`)
    }
}
function addAPIGames() {
    var url = "https://www.thebluealliance.com/api/v3"

    var sql = `INSERT INTO games (name, location, date, key) VALUES (?, ?, ?, ?)`

    for (var j = 0; j < 1; j++) {
        axios.get(`${url}/events/2022/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
          .then(response => {
            for (var i = 0; i < response.data.length; i++) {
              db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key])
            }
            
            
        })
          .catch(error => {
            console.log(error);
          });
    }
}

function addAPIMatches() {
    var url = "https://www.thebluealliance.com/api/v3"

    var sql = `INSERT INTO matches (gameId, matchId, teamNumber, key) VALUES (?, ?, ?, ?)`

    axios.get(`${url}/event/2022cc/matches`, {
        headers: {'X-TBA-Auth-Key': process.env.KEY}
      })
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            // db.run(sql, [response.data[i].team_number, response.data[i].nickname, response.data[i].key])
            // db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key])
            db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[0], response.data[i].key])
            db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[1], response.data[i].key])
            db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[2], response.data[i].key])
            db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[0], response.data[i].key])
            db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[1], response.data[i].key])
            db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[2], response.data[i].key])
    
          }
          
          
      })
        .catch(error => {
          console.log(error);
        });
}


recreateTable()

addAPITeams()
addAPIGames()

// Broken because match api only gets team keys not the team number, could fix by just cutting off the frc at the front
// addAPIMatches()

getMatchData(1, 42)
getTeamAverage(8033)
// var sql = `UPDATE users
//                     SET access = ?
//                     WHERE username = ?`
// db.run(sql, ["asdfasdfasdf", "Joe"], function(err) {    if (err) {
//         return console.error(err.message)
//     }
//     console.log(`Row(s) updated: ${this.changes}`)
// })

// var name = "Joe"
// var sql = `SELECT * FROM users WHERE username = '${name}'`
// db.all(sql, [], (err, rows) => {
//     if (err) {
//         return console.error(err)
//     }

//     if (rows.length == 0) {
//         sql = `INSERT INTO users(username, password, access) VALUES (?,?,?)`
//         db.run(sql, [name, "Nuts", "asdfasdffdsa"], function(err) {    if (err) {
//             return console.error(err.message)
//         }
//         console.log(`Row(s) updated: ${this.changes}`)
//         })
//     }
// })