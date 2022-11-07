const sqlite = require("sqlite3").verbose()
const axios = require("axios")

// Connect to db
const db = new sqlite.Database('./teams.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});


function dropTable() {
    var sql = `
        DROP TABLE teams
    `
    db.run(sql)
}

function createTable() {
    var sql = `
        CREATE TABLE teams(
        teamNumber INTEGER PRIMARY KEY, 
        teamName TEXT ONLY, 
        tournaments TEXT ONLY
    )`
    db.run(sql)
}

createTable()
// dropTable()


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