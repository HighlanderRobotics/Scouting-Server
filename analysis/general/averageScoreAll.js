const BaseAnalysis = require('../BaseAnalysis.js')
const averageScore = require('./averageScore.js')

// const Manager = require('./manager/dbmanager.js')

class averageScoreAll extends BaseAnalysis {
    static name = `averageScoreAll`

    constructor(db) {
        super(db)
        // this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.average

    }
    getAccuracy() {
        let a = this
        return new Promise(async function (resolve, reject) {
            var sql = `SELECT teamNumber
            FROM teams
            LIMIT 5 `
            let arr = []

            a.db.all(sql, [], async (err, rows) => {
                if (err) {
                    console.log(err)

                }
                console.log("before")
                await rows.forEach(async (row, index, array) => {
                    let temp = new averageScore(a.db, row.teamNumber)
                    await temp.runAnalysis()
                    arr.push(temp.average)
                    console.log("last")
                })
                console.log("after")

                const sum = arr.reduce((partialSum, a) => partialSum + a, 0)
                a.average = sum / arr.length
                console.log("avg " + a.average)
            })

            resolve("done")
        })
            .catch((err) => {
                if (err) {
                    return err
                }
            })
            .then((data) => {
                // console.log(data)
                return data
            })
    }
    
    async getAvg(team) {
        let a = this
        let temp = new averageScore(a.db, team)
        await temp.runAnalysis()
        return temp.average
    }

    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            a.result = temp
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            // "team": this.team
        }
    }

}
module.exports = averageScoreAll
