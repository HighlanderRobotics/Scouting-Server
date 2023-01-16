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
        return new Promise(function (resolve, reject) {
            var sql = `SELECT scoutReport, newMatches.key AS key
                FROM data
                JOIN (SELECT matches.key AS key
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    ) AS  newMatches ON  data.matchKey = newMatches.key`
            let answer = []

            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {

                        let data = JSON.parse(row.scoutReport)
                        let total = 0

                        if (data.challengeResult === 1) {
                            total += 6
                        }
                        else if (data.challengeResult === 2) {
                            total += 10
                        }
                        else if (data.challengeResult === 4) {
                            //check this
                            total += 3
                        }

                        if (data.autoChallengeResult === 1) {
                            total += 8
                        }
                        else if (data.autoChallengeResult === 2) {
                            total += 12
                        }


                        let arr = data.events
                        for (let i = 0; i < arr.length; i++) {

                            const entry = arr[i];
                            let max = Math.ceil(entry[2] / 3)
                            if (entry[0] <= 17 && entry[1] === 2) {
                                if (max === 3) {
                                    total += 6
                                }
                                if (max === 2) {
                                    total += 4
                                }
                                if (max === 1) {
                                    total += 3
                                }
                            }
                            else if (entry[1] === 2) {
                                if (max === 3) {
                                    total += 5
                                }
                                if (max === 2) {
                                    total += 3
                                }
                                if (max === 1) {
                                    total += 2
                                }
                            }

                        }
                        answer.push(total)

                    }
                    const sum = answer.reduce((partialSum, a) => partialSum + a, 0)
                    a.average = sum / answer.length
                    resolve("done")


                }
            })



                


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
