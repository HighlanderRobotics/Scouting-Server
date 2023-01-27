const BaseAnalysis = require('../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class defenseEvent extends BaseAnalysis {
    static name = `defenseEvent`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
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
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let total = 0
                        let prev = 0
                        let curr = JSON.parse(row.scoutReport).events
                        match.push(row.key)
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
                a.matches = match

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
            "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            }))
        }
    }

}
module.exports = defenseEvent
