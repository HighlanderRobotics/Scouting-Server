const BaseAnalysis = require('../../BaseAnalysis.js')
//number of cargo of certain type (cone or cube) the team scores during auto ( < 17 seconds)
//gives average (and array)
class cargoCountAutoAll extends BaseAnalysis {
    static name = `cargoCountAutoAll`
    constructor(db, objectType) {
        super(db)
        this.objectType = objectType
        this.result = 0
        this.array = []

    }
    async getCount() {
        let a = this
        return new Promise(async function (resolve, reject) {
            //why does await not work when it works in  bestAverageForMetric
            var sql = `SELECT scoutReport
                FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey)
                     AS  newMatches ON  data.matchKey = newMatches.key
              `
            let len = 0
            let makes = 0
            let object = false
            let arr = []
            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events

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
                                arr.push(makes)
                                break
                            }


                        }



                        len++

                    }
                }



                a.result = makes / len
                a.array = arr
                resolve(makes / len)
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
            await a.getCount().catch((err) => {
                if (err) {

                    console.log(err)
                    return err
                }
            })
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team,
            "array" : this.array
        }
    }

}

module.exports = cargoCountAutoAll
