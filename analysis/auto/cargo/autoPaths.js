const { map } = require('mathjs')
const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCountAuto extends BaseAnalysis {
    static name = `cargoCountAuto`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.start = start
        // this.end = end
        this.array = []

    }
    async getAccuracy() {
        let a = this
        return new Promise(async function (resolve, reject) {

            var sql = `SELECT scoutReport, newMatches.key AS key
                FROM data
            JOIN (SELECT matches.key AS key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
               
          `;
            let map = new Map()
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        let arr = []
                        for (var i = 0; i < curr.length; i++) {

                            let subArr = curr[i]

                            if (subArr[0] < 16) {
                                if (subArr[1] === 10 || subArr[1] === 11 || subArr === 12) {
                                    arr.push(subArr[1])
                                }
                                else {
                                    arr.push(subArr[2])
                                }

                            }
                            else {
                                let stringedArray = arr.toString()
                                let total = 0
                                let data =  JSON.parse(row.scoutReport)
                                if (data.autoChallengeResult === 1) {
                                    total += 8
                                }
                                else if (data.autoChallengeResult === 2) {
                                    total += 12
                                }
                                for (var i = 0; i < curr.length; i++) {
                                    let entry = curr[i]
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
                                }
                                if (map.has(stringedArray)) {
                                    map.set(stringedArray, map.get(stringedArray).freq +1)
                                }
                                else {
                                    let temp = { "freq" : 1, "score" : total}
                                    map.set(stringedArray, temp)
                                }
                            }

                        }
                    }

                }

                let arr = [];
                map.forEach((value, key) => {
                    arr.push({ position: key, frequency: value.freq, score : value.score });
                });
                a.array = arr
                resolve("done")

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

    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
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
            "array": this.array,
            "team": this.team
        }
    }

}
module.exports = cargoCountAuto
