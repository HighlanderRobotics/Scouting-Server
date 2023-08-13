const { re, resolve } = require('mathjs')
const Manager = require('./Manager.js')
//adds or updates

class addMutablePicklist extends Manager {
    static name = "addMutablePicklist"

      constructor() {
        super()
    }

    async runTask(uuid, name, teams, team) {
        if(team == null)
        {
            return("no team")
        }
        let teamsStringed = JSON.stringify(teams)

        var sql = `SELECT * FROM mutablePicklists WHERE uuid = ?`
        var sql2 = `DELETE FROM mutablePicklists
        WHERE uuid = ?`
        var sql3 = `INSERT INTO mutablePicklists (uuid, name, teams, team) VALUES (?, ?, ?, ?)`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [uuid, name, teams, team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (rows.length == 1)
                {
                    Manager.db.all(sql2, [uuid], (err, rows) =>{
                        if (err)
                        {
                            console.log(err)
                            reject(err)
                        }
                    })
                }
                Manager.db.all(sql3, [uuid, name, teamsStringed], (err) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("done")
                })
            })
           
        })

    }
}

module.exports = addMutablePicklist