const { re } = require('mathjs')
const Manager = require('./Manager.js')

class editData extends Manager {
    static name = "editData"

      constructor() {
        super()
    }

    async runTask(uuid, matchKey, scouterName, startTime, scoutReport, notes) {

        var sql = `SELECT * FROM data WHERE uuid = ?`
        var sql2 = `DELETE FROM data
        WHERE uuid = ?`
        var sql3 = `INSERT INTO data (uuid, matchKey, scouterName, startTime, scoutReport, notes) VALUES (?, ?, ?, ?, ?, ?)`

        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [uuid], (err, rows) => {
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
                Manager.db.all(sql3, [uuid, matchKey, scouterName, startTime, scoutReport, notes], (err) => {
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

module.exports = editData