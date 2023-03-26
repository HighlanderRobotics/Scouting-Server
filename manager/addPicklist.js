const Manager = require('./Manager.js')
const axios = require("axios")

class addPicklist extends Manager {
    static name = "addPicklist"

    constructor() {
        super()
    }

    async runTask(uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) {

        var sql = `INSERT INTO sharedPicklists (uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) VALUES (?, ?, ?, ? ?, ?, ?, ?, ?, ?, ?, ? ?, ?, ?, ?, ?)`
        Manager.db.run(sql, [uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility], (err) =>
        {
            if (err)
            {
                console.log(err)
            }
        })

    }
}

module.exports = addPicklist