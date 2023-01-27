const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCountAuto extends BaseAnalysis {
    static name = `cargoCountAuto`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        this.type = type
        // this.start = start
        // this.end = end
        this.matches = []
        this.result = 0
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
            let arr = []
            let match = []
            let len = 0
            let object = false
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        match.push(row.key)
                        for (var i = 0; i < curr.length; i++) {

                            let subArr = curr[i]
                            let makes = 0

                            if (subArr[0] < 17) {
                                if (subArr[1] === a.type) {
                                    object = true
                                }
                                if (subArr[1] === 3) {
                                    object = false
                                }
                                if (subArr[1] === 2 && object == true) {
                                    makes++
                                    object = false

                                }
                                if (subArr[1] === 4) {
                                    object = false
                                }
                            }
                            else {
                                break
                            }



                        }
                        arr.push(makes)                        
                    }

                }
                //   makes/len)
                //  console.log(arr)
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
module.exports = cargoCountAuto
