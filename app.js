const sqlite = require("sqlite3").verbose()
const axios = require("axios")

// Connect to db
const db = new sqlite.Database('./users.db', sqlite.OPEN_READWRITE, (err) => {
    if (err)
        console.error(err)
});

async function dropTable() {
    var sql = `DROP TABLE users`
    db.run(sql)
    return;
}

function recreateTable() {
    var sql = `CREATE TABLE users(username PRIMARY KEY, password NOT NULL, access)`
    db.run(sql)
}


dropTable().then(() => {
    recreateTable()
})

// sql = `INSERT INTO users(username PRIMARY KEY, password, access) VALUES (?,?,?)`
// db.run(sql, ["Joe", "Nuts", "cNILjiZj4dmRUNem0iKpJqpKh5ngoADse0emqDhqCOeqxgs48cd3USwJQXiRf7le"], function(err) {    if (err) {
//     return console.error(err.message)
// }
// console.log(`Row(s) updated: ${this.changes}`)
// })

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