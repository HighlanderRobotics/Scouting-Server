const BaseAnalysis = require('./BaseAnalysis.js')
const AverageScore = require('./general/averageScore.js')
const math = require('mathjs')

class trends extends BaseAnalysis {
    static name = `trends`

    constructor(db, team) {
        super(db)
        this.team = team
        this.result = this.result
    }
    async getTrend() {
        let a = this
        let score = new AverageScore(a.db, a.team, 1)
        await score.runAnalysis()
        let scoreArr = score.array
        let avgScore = score.average
        let sql = `SELECT notes, uuid, newMatches.matchNumber AS matchNum, newMatches.key AS matchKey, scouterName
        FROM data
        JOIN (SELECT matches.key, matches.matchNumber
            FROM matches 
            JOIN teams ON teams.key = matches.teamKey
            WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
        return new Promise(function (resolve, reject) {
            a.db.all(sql, [a.team], (err, rows) => {
                if (rows.length == 0) {
                    a.result = null
                    resolve("done")
                    return
                }
                else {
                    if(scoreArr.length < 3)
                    {
                        a.result = 2
                        resolve("done")
                        return
                    }
                    let num = (scoreArr[scoreArr.length - 3] - scoreArr[scoreArr.length - 2]) + (scoreArr[scoreArr.length - 2] - scoreArr[scoreArr.length - 1]) / 2
                    if (math.abs(num) >= avgScore / 3) {
                        if (num < 0) {
                            a.result = 0
                        }
                        else {
                            a.result = 4
                        }
                    }
                    else if (math.abs(num) <= avgScore / 10) {


                        a.result = 2
                    }
                    else {

                        if (num < 0) {
                            a.result = 1
                        }
                        else {
                            a.result = 3
                        }
                    }
                }
                resolve("done")
            })

        })


    }



    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.getTrend().catch((err) => {

            })
            resolve("done")
        })


    }

    finalizeResults() {
        return {
            "team": this.team,
            "result": this.result
        }
    }
}

module.exports = trends