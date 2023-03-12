const { row } = require('mathjs')
const Manager = require('../manager/dbmanager')
const BaseAnalysis = require('./BaseAnalysis')
const picklist = require('./picklist')
class picklistShell extends BaseAnalysis {
    static name = `picklistShell`

    constructor(db, tourmentKey, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, autoCargo, teleOp, defense, autoClimb, feedCone, feedCube, avgTotal, teleppClimb) {
        super(db)
        this.tourmentKey = tourmentKey
        this.cubeOneScore = cubeOneScore
        this.cubeTwoScore = cubeTwoScore
        this.cubeThreeScore = cubeThreeScore
        this.autoCargo = autoCargo
        this.teleOp = teleOp
        this.result = []
        this.coneOneScore = coneOneScore
        this.coneTwoScore = coneTwoScore
        this.coneThreeScore = coneThreeScore
        this.defense = defense
        this.autoClimb = autoClimb
        this.feedingCone = feedCone
        this.feedingCube = feedCube
        this.avgTotal = avgTotal
        this.teleppClimb = teleppClimb
    }


    async getPicklist() {
        let a = this
        return new Promise(async function (resolve, reject) {
            let arr = []
            var sql = `SELECT teams.teamNumber
                    FROM teams
                    JOIN matches on matches.teamKey = teams.key
                    WHERE matches.tournamentKey = ?
                    GROUP BY teams.teamNumber `;
            a.db.all(sql, [a.tourmentKey], async (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    for (let row in rows) {
                        let curr = new picklist(a.db, rows[row].teamNumber, a.coneOneScore, a.coneTwoScore, a.coneThreeScore, a.cubeOneScore, a.cubeTwoScore, a.cubeThreeScore, a.autoCargo, a.teleOp, a.defense, a.autoClimb, a.feedingCone, a.feedingCube, a.avgTotal, a.teleppClimb)
                        await curr.runAnalysis()

                        if (!isNaN(curr.result)) {
                            let temp = { "team": rows[row].teamNumber, "result": curr.result, "breakdown" : curr.array }
                            arr.push(temp)
                        }
                    }


                }
                a.result = arr.sort((a, b) => b.result - a.result)
                resolve("done")

            })

        })
            .catch((err) => {
                if (err) {
                    return err
                }
            })
            .then((data) => {
                return data
            })
    }

    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            await a.getPicklist().catch((err) => {
                if (err) {
                    return err
                }
            })

            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result
        }
    }

}
module.exports = picklistShell