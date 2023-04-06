const { re } = require('mathjs')
const Manager = require('./Manager.js')
//adds or updates

class addPickedTeam extends Manager {
    static name = "addPickedTeam"

      constructor() {
        super()
    }

    async runTask(team) {

        var sql = `SELECT * FROM pickedTeams`
        var sql2 = `DELETE FROM pickedTeams`
        var sql3 = `INSERT INTO mutablePicklists (teams) VALUES (?)`
        let arr = []
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (rows.length == 1)
                {
                    arr = rows.map((row) => ({
                        ...row,
                        teams: JSON.parse(row.teams).map(team => parseInt(team)),
                    }))
                    arr.push(team)
                    Manager.db.all(sql2, [], (err, rows) =>{
                        if (err)
                        {
                            console.log(err)
                            reject(err)
                        }
                    })
                }
                Manager.db.all(sql3, [JSON.stringify(arr)], (err) => {
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

module.exports = addPickedTeam