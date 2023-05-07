const BaseAnalysis = require('../BaseAnalysis.js')
//total score (both teleop and auto) over all teams
class totalScoreAllPicklist extends BaseAnalysis {
    static name = `totalScoreAllPicklist`

    constructor(db) {
        super(db)

        this.array = []
        this.average = 0
        this.matches = []
        
    }
    async scoresOverTime() {
        let a = this
        return new Promise(function (resolve, reject) {
            var sql = `SELECT scoutReport, newMatches.key AS key
            FROM data
            JOIN (SELECT matches.key AS key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
              ) AS  newMatches ON  data.matchKey = newMatches.key`
            let answer = []
            let match = []

            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    if (rows != []) {

                        rows.forEach(functionAdder);
                        function functionAdder(row, index, array) {

                            let data = JSON.parse(row.scoutReport)
                            match.push(row.key)
                            let total = 0
                                if (data.autoChallengeResult === 1) {
                                    total += 8
                                }
                                else if (data.autoChallengeResult === 2) {
                                    total += 12
                                }
                                else if (data.autoChallengeResult === 4) {
                                    total += 3
                                }
                            
                                if (data.challengeResult === 1) {
                                    total += 6
                                }
                                else if (data.challengeResult === 2) {
                                    total += 10
                                }
                                else if (data.challengeResult === 4) {
                                    total += 2
                                }
                            




                            let arr = data.events
                            for (let i = 0; i < arr.length; i++) {

                                const entry = arr[i];
                                let max = Math.ceil(entry[2] / 3)
                                if (entry[0] < 17 && entry[1] === 2) {
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
                                else if (entry[1] === 2 && entry[0] >= 17) {
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
                    

                    }
                    a.array = answer
                    const sum = answer.reduce((partialSum, a) => partialSum + a, 0)
                    a.average = sum / answer.length                    
                    a.matches = match


                }                

                resolve("done")

            })
        })
    }
    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.scoresOverTime().catch((err) => {
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
            "array": this.array,
            "arrayNoMatches": this.array,
            "team": this.team,
        }
    }
}
module.exports = totalScoreAllPicklist