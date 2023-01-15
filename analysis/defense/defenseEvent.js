const BaseAnalysis = require('../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class defenseEvent extends BaseAnalysis {
    static name = `defenseEvent`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        this.type = type
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = []
        this.matches

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
            let arr = []
            let match = []
            let len = 0
            let makes = 0
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                rows.forEach(functionAdder);
                function functionAdder(row, index, array) {
                    let curr = JSON.parse(row.scoutReport).events
                    match.push(row.key)
                    for (var i = 0; i < curr.length; i++) {
                        //change numbers
                        let subArr = curr[i]

                        if (subArr[1] === a.type) {
                            makes++
                            console.log(makes)

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
            "matches": this.match,
            "array": this.array
        }
    }

}
module.exports = defenseEvent
