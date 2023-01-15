const BaseAnalysis = require('../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class defenseEventAll extends BaseAnalysis {
    static name = `defenseEventAll`

    constructor(db, type) {
        super(db)
        this.type = type
        // this.start = start
        // this.end = end
        this.result = 0

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
            let len = 0
            let makes = 0
            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                rows.forEach(functionAdder);
                function functionAdder(row, index, array) {
                    let curr = JSON.parse(row.scoutReport).events

                    for (var i = 0; i < curr.length; i++) {
                        //change numbers
                        let subArr = curr[i]

                        if (subArr[1] === a.type) {

                            makes++
                        }
                    }
                    len++

                }
                //  console.log(makes/len)
                //  console.log(arr)
                a.result = makes / len
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
            console.log(a.result)

            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result
        
                }
    }

}
module.exports = defenseEventAll
