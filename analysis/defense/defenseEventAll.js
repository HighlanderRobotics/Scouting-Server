const BaseAnalysis = require('../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class defenseEventAll extends BaseAnalysis {
    static name = `defenseEventAll`

    constructor(db) {
        super(db)
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = []

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
            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {


                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        let total = 0
                        let prev = 0
                        for (var i = 0; i < curr.length; i++) {
                            //change numbers
                            let subArr = curr[i]

                            if (subArr[1] === 5) {
                                prev = subArr[0]
 
                             }
                             else if (subArr[1] === 6)
                             {
                                 total += subArr[0] - prev
                             }
                        }
                        arr.push(total)
                    }
                

                }
                a.array = arr
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
            "array" : this.array

        }
    }

}
module.exports = defenseEventAll
