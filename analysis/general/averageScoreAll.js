const { to } = require('mathjs')
const BaseAnalysis = require('../BaseAnalysis.js')
const averageScore = require('./averageScore.js')

//Calculates average score in their autonomus or teleop for a given team
//gives an array with matches and an average
class averageScoreAll extends BaseAnalysis {
    static name = `averageScoreAll`

    constructor(db, autoOrTele) {
        super(db)
        this.average = 0
        // auto = 0
        // teleop = 1
        this.autoOrTele = autoOrTele
        this.array = []
        this.cargo = 0
        //change cargo to 1 if only cargo should be inluded (no charging)
        this.totalPicklist = 0
        this.pickArray = []

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
            let picklistArray = []

            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let otherPick = 0


                        let data = JSON.parse(row.scoutReport)
                        let total = 0

                        if (a.autoOrTele === 0 && a.cargo === 0) {
                            if (data.autoChallengeResult === 1) {
                                total += 8
                            }
                            else if (data.autoChallengeResult === 2) {
                                total += 12
                            }

                        }
                        else if(a.autoOrTele === 1){
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
                        }




                        let arr = data.events
                        for (let i = 0; i < arr.length; i++) {

                            const entry = arr[i];
                            let max = Math.ceil(entry[2] / 3)
                            if (entry[0] <= 17 && entry[1] === 2 && a.autoOrTele === 0) {
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
                            else if (entry[1] === 2 && a.autoOrTele === 1) {
                                if (max === 3) {
                                    total += 5
                                    otherPick += 5
                                }
                                if (max === 2) {
                                    total += 3
                                    otherPick += 3

                                }
                                if (max === 1) {
                                    total += 2
                                    otherPick += 2

                                }
                            }

                        }
                        answer.push(total)
                        picklistArray.push(otherPick)

                    }
                    const sum = answer.reduce((partialSum, a) => partialSum + a, 0)
                    a.average = sum / answer.length
                    a.array = answer
                    a.totalPicklist = picklistArray.reduce((partialSum, a) => partialSum + a, 0) / picklistArray.length
                    a.pickArray = picklistArray
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
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            "array": this.array
            // "team": this.team
        }
    }

}
module.exports = averageScoreAll
