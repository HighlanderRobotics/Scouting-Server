const { re } = require('mathjs')
const Manager = require('./Manager.js')

class addPicklist extends Manager {
    static name = "addPicklist"

      constructor() {
        super()
    }

    async runTask(uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) {

        var sql = `SELECT * FROM sharedPicklists WHERE uuid = ?`
        var sql2 = `DELETE FROM sharedPicklists
        WHERE uuid = ?`
        var sql3 = `INSERT INTO sharedPicklists (uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?)`

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
                Manager.db.all(sql3, [uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility], (err) => {
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

module.exports = addPicklist