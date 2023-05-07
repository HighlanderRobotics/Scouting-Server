const BaseAnalysis = require('../../BaseAnalysis.js')
//number of cargo of certain type (cone or cube) the team scores during auto ( < 17 seconds)
//gives average and array with matches
class cargoCountAuto extends BaseAnalysis {
    static name = `cargoCountAuto`
    constructor(db, team, objectType) {
        super(db)
        this.team = team
        this.objectType = objectType
        this.matches = []
        this.average = 0
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
            let object = false
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        let makes = 0
                        match.push(row.key)
                        for (var i = 0; i < curr.length; i++) {

                            let subArr = curr[i]

                            if (subArr[0] < 17) {
                                if (subArr[1] === a.objectType) {
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
                a.array = arr
                a.average = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
                if(a.average === null)
                {
                    a.average = 0
                }
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
                return data
            })
    }

    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
           await a.getAccuracy().catch((err) => {
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
            "team": this.team,
            "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            }))
        }
    }

}
module.exports = cargoCountAuto
