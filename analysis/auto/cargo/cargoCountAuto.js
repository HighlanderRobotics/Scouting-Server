const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCountAuto extends BaseAnalysis {
    static name = `cargoCountAuto`

    constructor(db, team, type, start) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        this.type = type
        // this.start = start
        // this.end = end
        this.matches = []
        this.result = 0
        this.array = []
        this.start = start

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
                ORDER BY data.startTime
                LIMIT ?
          `;
            let arr = []
            let match = []
            let len = 0
            let makes = 0
            a.db.all(sql, [a.team, a.start], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                rows.forEach(functionAdder);
                function functionAdder(row, index, array) {
                    let curr = JSON.parse(row.scoutReport).events
                    match.push(row.key)
                    for (var i = 0; i < curr.length; i++) {

                        let subArr = curr[i]

                        if (subArr[2] < 17) {
                            if (subArr[1] === 3 && curr[i - 1][1] === a.type) {
                                makes++
                                console.log(makes)

                            }
                            else {
                                break
                            }
                        }

                    }
                    len++
                    arr.push(makes)

                }
                //  console.log(makes/len)
                //  console.log(arr)
                a.array = arr
                a.result = makes / len
                a.matches = match
                console.log(a.array)
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
            "result": this.result,
            "team": this.team,
            "array": this.array,
            "matches" : this.matches
        }
    }

}
module.exports = cargoCountAuto
