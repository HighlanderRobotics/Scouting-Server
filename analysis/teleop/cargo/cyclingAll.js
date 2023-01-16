const BaseAnalysis = require('../../BaseAnalysis.js')


// const Manager = require('./manager/dbmanager.js')

class cyclingAll extends BaseAnalysis {
    static name = `cyclingAll`

    constructor(db, type, location) {
        super(db)
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.type = type
        this.location = location
        this.result = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        return new Promise(async function (resolve, reject) {

            var sql = `SELECT scoutReport
                FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
               ) AS  newMatches ON  data.matchKey = newMatches.key
          `;
            let arr = []
            let len = 0

            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                if (rows != []) {

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        let prev = 0
                        let total = 0
                        for (var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]
                            if (subArr[1] === a.type) {
                                prev = subArr[0]
                            }
                            if (subArr[1] == a.location) {
                                total += subArr[0] - prev
                                len++
                            }
                            if (subArr[1] === 3) {
                                prev = 0
                            }

                        }
                        arr.push(total / len)
                    }

                }
                a.result = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
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
            "result": this.result,
            "team": this.team
        }
    }

}
module.exports = cyclingAll
