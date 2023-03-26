const { re } = require('mathjs')
const Manager = require('./Manager.js')

class editPicklist extends Manager {
    static name = "editPicklist"

    constructor() {
        super()
    }

    async runTask(uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) {

        var sql = `DELETE FROM sharedPicklists
        WHERE uuid = ?`
        var sql2 = `INSERT INTO sharedPicklists (uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) VALUES (?, ?, ?, ? ?, ?, ?, ?, ?, ?, ?, ? ?, ?, ?, ?, ?)`

        return new Promise(async (resolve, reject) => {
            Manager.db.run(sql, [uuid], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
            })
            Manager.db.run(sql2, [uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility], (err) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("done")
            })
        })

    }
}

module.exports = editPicklist