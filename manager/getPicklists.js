const Manager = require('./Manager.js')
const axios = require("axios")
const { resolve, row } = require('mathjs')

class getPicklists extends Manager {
    static name = "getPicklists"

    constructor() {
        super()
    }

    async runTask(uuid, name, cubeOneScore, cubeTwoScore, cubeThreeScore, coneOneScore, coneTwoScore, coneThreeScore, autoCargo, teleopScore, defenseScore, autoClimb, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) {

        var sql = `SELECT *
        FROM sharedPicklists` 
        Manager.db.run(sql, [uuid], (err, rows) =>
        {
            if (err)
            {
                console.log(err)
            }
            resolve(rows)

        })

    }
}

module.exports = getPicklists