const sqlite = require("sqlite3").verbose()
//const axios = require("axios")

// Connect to db
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});


function getMatchData(gId, mId) {
    var sql = `SELECT matches.matchId, games.name, matches.teamNumber, teams.teamName, scores.data 
        FROM matches
        join teams on matches.teamNumber  = teams.teamNumber 
        join scores on matches.id  = scores.mId 
        join games on matches.gameId  = games.gameId 
        where matches.gameId = ? and matches.matchId = ?;` 

        db.each(sql, [gId, mId], (err, row) => {
            if (err) {
              throw err;
            }
            console.log(`${row.matchId} ${row.name} ${row.teamNumber} ${row.teamName}\t${row.data}`);
        });
}

function recreateTable() {

    var createTeams = `
        CREATE TABLE teams(
            teamNumber INTEGER PRIMARY KEY, 
            teamName TEXT ONLY
        );`

    var createGames = `
        CREATE TABLE games (
            gameId INTEGER PRIMARY KEY, 
            name VARCHAR(20), 
            location VARCHAR(20),
            date INTEGER);`

    var createMatches = `
        CREATE TABLE matches (
            id INTEGER PRIMARY KEY, 
            gameId INTEGER NOT NULL,
            matchId INTEGER KEY,
            teamNumber INTEGER NOT NULL,
            UNIQUE (matchId, gameId, teamNumber),
            FOREIGN KEY(gameId) REFERENCES games(gameId),
            FOREIGN KEY(teamNumber) REFERENCES teams(teamNumber)
            );        
            `

    var createScores = `
    CREATE TABLE scores (
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

    var insertMatches = `
        INSERT INTO matches (gameId, matchId, teamNumber) VALUES
        (1, 12, 254),
        (1, 12, 8033),
        (1, 12, 976),
        (1, 42, 1678),
        (1, 42, 487),
        (1, 42, 991),
        (1, 42, 2017),
        (2, 27, 254),
        (2, 27, 8033),
        (2, 27, 1678),
        (2, 27, 3251);
        (2, 27, 2017);
        `

    var insertScores = `
        INSERT INTO scores (mId, data) VALUES
        (3, "{some json blob}"),
        (4, "{even more json blob}"),
        (5, "{more json blob data}"),
        (6, "{another json blob}"),
        (7, "{one more json blob}");
        `

    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS `teams`")
        db.run(createTeams)
        db.run("DROP TABLE IF EXISTS `games`")
        db.run(createGames)

        db.run("DROP TABLE IF EXISTS `matches`")
        db.run(createMatches)

        db.run("DROP TABLE IF EXISTS `scores`")
        db.run(createScores)

        db.run(insertTeams)
        db.run(insertGames)
        db.run(insertMatches)
        db.run(insertScores)

        // Sample data
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [254, "The Cheesy Poofs", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [8033, "Highlander Robotics", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [1678, "Citrus Circuits", "[]"])
    })
}


recreateTable()
getMatchData(1, 42)

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