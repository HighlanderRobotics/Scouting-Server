const sqlite = require("sqlite3").verbose()
//const axios = require("axios")

// Connect to db
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});

function recreateTable() {

    var create_teams = `
        CREATE TABLE teams(
            team_number INTEGER PRIMARY KEY, 
            team_name TEXT ONLY
        );`

    var create_games = `
        CREATE TABLE games (
            game_id INTEGER PRIMARY KEY, 
            name VARCHAR(20), 
            location VARCHAR(20),
            date INTEGER);`

    var create_matches = `
        CREATE TABLE matches (
            id INTEGER PRIMARY KEY, 
            game_id INTEGER NOT NULL,
            match_id INTEGER KEY,
            team_number INTEGER NOT NULL,
            UNIQUE (match_id, game_id, team_number),
            FOREIGN KEY(game_id) REFERENCES games(game_id),
            FOREIGN KEY(team_number) REFERENCES teams(team_number)
            );        
            `

    var create_scores = `
    CREATE TABLE scores (
        id INTEGER PRIMARY KEY, 
        mid INTEGER NOT NULL,
        data VARCHAR(3000),
        FOREIGN KEY(mid) REFERENCES matches(id)
        );        
        `
    
    var insert_teams = `
        INSERT INTO teams (team_number, team_name) VALUES
        (254, "The Cheesy Poofs"),
        (8033, "Highlander Robotics"),
        (1678, "Citrus Circuits");
    `
    var insert_games = `
        INSERT INTO games (name, location, date) VALUES
        ("chezy", "San Jose", DATE('2022-09-24')),
        ("worlds", "Houston", DATE('2022-04-20'));
    `

    var insert_matches = `
        INSERT INTO matches (game_id, match_id, team_number) VALUES
        (1, 12, 254),
        (1, 12, 8033),
        (1, 42, 1678),
        (1, 42, 8033),
        (2, 27, 254),
        (2, 27, 8033),
        (2, 27, 1678),
        (2, 27, 3251);
        `

    var insert_scores = `
        INSERT INTO scores (mid, data) VALUES
        (3, "{some json blob}"),
        (4, "{another json blob}");
        `


    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS `teams`")
        db.run(create_teams)
        db.run("DROP TABLE IF EXISTS `games`")
        db.run(create_games)

        db.run("DROP TABLE IF EXISTS `matches`")
        db.run(create_matches)

        db.run("DROP TABLE IF EXISTS `scores`")
        db.run(create_scores)

        db.run(insert_teams)
        db.run(insert_games)
        db.run(insert_matches)
        db.run(insert_scores)

        // Sample data
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [254, "The Cheesy Poofs", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [8033, "Highlander Robotics", "[]"])
        // db.run(`INSERT INTO teams VALUES (?, ?, ?)`, [1678, "Citrus Circuits", "[]"])
    })
}


recreateTable()


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