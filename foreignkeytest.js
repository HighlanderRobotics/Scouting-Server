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
    var sql = `SELECT matches.matchId, tournaments.name, matches.teamNumber, teams.teamName, data.data 
        FROM matches
        JOIN teams ON matches.teamNumber  = teams.teamNumber 
        JOIN data ON matches.id = data.mId 
        JOIN tournaments ON matches.gameId  = tournaments.gameId 
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
            key TEXT ONLY PRIMARY KEY,
            teamNumber INTEGER, 
            teamName TEXT ONLY,
            UNIQUE (key, teamNumber, teamName)
        );`

    var createTournaments = `
        CREATE TABLE tournaments (
            key TEXT ONLY PRIMARY KEY,
            name TEXT ONLY, 
            location VARCHAR(50),
            date TEXT ONLY VARCHAR(20),
            UNIQUE (key, date)
        );`

    var createMatches = `
        CREATE TABLE matches (
            key PRIMARY KEY,
            gameKey TEXT ONLY NOT NULL,
            matchNumber INTEGER,
            teamKey TEXT ONLY NOT NULL,
            matchType TEXT ONLY NOT NULL,
            UNIQUE (gameKey, matchNumber, teamKey),
            FOREIGN KEY(gameKey) REFERENCES tournaments(key),
            FOREIGN KEY(teamKey) REFERENCES teams(key)
            );        
            `

    var createData = `
    CREATE TABLE data (
        id INTEGER PRIMARY KEY, 
        matchKey INTEGER NOT NULL,
        data VARCHAR(3000),
        UNIQUE (matchKey, data),
        FOREIGN KEY(matchKey) REFERENCES matches(key)
    );        
    `
        
    var insertTeams = `
        INSERT INTO teams (key, teamNumber, teamName) VALUES
        ("frc254", 254, "The Cheesy Poofs"),
        ("frc468", 468, "Aftershock"),
        ("frc487", 487, "Spartans"),
        ("frc976", 976, "Circuit Breakerz"),
        ("frc991", 991, "BroncoBots"),
        ("frc1678", 1678, "Citrus Circuits"),
        ("frc2017", 2017, "Trojans"),
        ("frc2023", 2023, "Robotic Dragons"),        
        ("frc8033", 8033, "Highlander Robotics");
    `
    var insertTournaments = `
        INSERT INTO tournaments (key, name, location, date) VALUES
        ("2022cc", "chezy", "San Jose", DATE('2022-09-24')),
        ("2022___________", "worlds", "Houston", DATE('2022-04-20'));
    `

    // Inserting sample chezy matches
    var insertMatches = `
        INSERT INTO matches (key, gameKey, matchNumber, teamKey, matchType) VALUES
            
        `

    var insertData = `
        INSERT INTO data (matchKey, data) VALUES
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
        db.run("DROP TABLE IF EXISTS `teams`")
        db.run(createTeams, (err) => {if (err) {console.error(`teams ${err}`)}})
        db.run("DROP TABLE IF EXISTS `tournaments`")
        db.run(createTournaments, (err) => {if (err) {console.error(`tournaments ${err}`)}})

        db.run("DROP TABLE IF EXISTS `matches`")
        db.run(createMatches, (err) => {if (err) {console.error(`matches ${err}`)}})

        db.run("DROP TABLE IF EXISTS `data`")
        db.run(createData, (err) => {if (err) {console.error(`data ${err}`)}})

        // db.run(insertTeams)
        // db.run(insertTournaments)
        // db.run(insertMatches)
        // db.run(bruhMomentum)
        // db.run(insertData)

        // Sample data
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [254, "The Cheesy Poofs", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [8033, "Highlander Robotics", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [1678, "Citrus Circuits", "[]"])
    })
}

function addAPITeams() {
    var url = "https://www.thebluealliance.com/api/v3"
    
    var sql = `INSERT INTO teams (key, teamNumber, teamName) VALUES (?, ?, ?)`

    for (var j = 0; j < 18; j++) {
        axios.get(`${url}/teams/${j}/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
          .then(response => {
            for (var i = 0; i < response.data.length; i++) {
              db.run(sql, [response.data[i].key, response.data[i].team_number, response.data[i].nickname], (err) => {
                if (err) {console.error(`Error with ${response.data[i]}`)}
              })
              // console.log(response.data[i].key);
            }
            
            
        }).catch(error => {
            console.log(error);
        });
        console.log(`Logged page ${j}`)
    }
}
function addAPITournaments() {
    var url = "https://www.thebluealliance.com/api/v3"

    var sql = `INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)`

    axios.get(`${url}/events/2022/simple`, {
        headers: {'X-TBA-Auth-Key': process.env.KEY}
    })
        .then(response => {
        for (var i = 0; i < response.data.length; i++) {
            db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key])
        }
        
        
    }).catch(error => {
        console.log(error);
    });
}

// Outdated version of a better one in dbmanager
function addAPIMatches() {
    var url = "https://www.thebluealliance.com/api/v3"


    axios.get(`${url}/event/2022cc/matches/simple`, {
        headers: {'X-TBA-Auth-Key': process.env.KEY}
    }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].comp_level == "qm") {
                console.log(`Adding qual match`)
                var teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                var matches = ``
                for (var k = 0; k < teams.length; k++) {
                    matches = matches + `('${response.data[i].key}_${k}', '2022cc', ${response.data[i].match_number}, '${teams[k]}', '${response.data[i].comp_level}'), `
                    if (k == 5) {
                        matches = matches.substring(0, matches.length - 2)
                    }
                }
                // console.log(matches)
                var sql = `INSERT INTO matches (key, gameKey, matchNumber, teamKey, matchType) VALUES ${matches}`
                // console.log(sql)

                db.run(sql)
                // console.log(response.data[i].key)

            }
            
        }

    }).catch(error => {
        console.log(error);
    });
}    

recreateTable()

// addAPITeams()
// addAPITournaments()
// addAPIMatches()

// getMatchData(1, 42)
// getTeamAverage(8033)
