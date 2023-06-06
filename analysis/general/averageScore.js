const BaseAnalysis = require('../BaseAnalysis.js')
//Calculates average score in their autonomus or teleop for a given team
//gives an array with matches and an average
class averageScore extends BaseAnalysis {
    static name = `averageScore`

    constructor(db, team, autoOrTele) {
        super(db)
        this.team = team
        this.array = []
        this.average = 0
        this.matches = []
        this.cargo = 0
        //change cargo to 1 if only cargo should be inluded (no charging)
        this.totalPicklist = 0
        // 0 = auto
        //1 = teleop
        this.autoOrTele = autoOrTele
    }
    async scoresOverTime() {
        let a = this
        return new Promise(function (resolve, reject) {
            var sql = `SELECT scoutReport, newMatches.key AS key
            FROM data
            JOIN (SELECT matches.key AS key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
            let arrayT = []
            let match = []
            a.db.all(sql, [a.team], (err, rows) => {

                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    let otherPick = 0
                    let len = 0
            
                    if (rows != []) {

                        rows.forEach(functionAdder);
                        function functionAdder(row, index, array) {
                            len += 1
                            let data = JSON.parse(row.scoutReport)
                            match.push(row.key)
                            let total = 0
                            if (a.autoOrTele === 0 && a.cargo === 0)  {
                                if (data.autoChallengeResult === 1) {
                                    total += 8
                                }
                                else if (data.autoChallengeResult === 2) {
                                    total += 12
                                }
                                else if (data.autoChallengeResult === 4)
                                {
                                    total += 3
                                }
                            }
                            else if(a.autoOrTele === 1){
                                if (data.challengeResult === 1) {
                                    total += 6
                                }
                                else if (data.challengeResult === 2) {
                                    total += 10
                                }
                                else if(data.challengeResult === 2)
                                {
                                    total += 2
                                }
                               
                            }




                            let arr = data.events
                            for (let i = 0; i < arr.length; i++) {

                                const entry = arr[i];
                                let max = Math.ceil(entry[2] / 3)
                                if (entry[0] < 17 && entry[1] === 2 && a.autoOrTele === 0) {
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
                                else if (entry[1] === 2  && a.autoOrTele === 1 && entry[0] >= 17) {
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

                            arrayT.push(total)

                        }


                    }
                    a.array = arrayT
                    const sum = arrayT.reduce((partialSum, a) => partialSum + a, 0)

                    a.totalPicklist = otherPick/len
                    a.average = sum / arrayT.length                    
                    a.matches = match


                }

                // a.result = arr
                

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
            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            })),
            "arrayNoMatches": this.array,
            "team": this.team,
        }
    }
}
module.exports = averageScore