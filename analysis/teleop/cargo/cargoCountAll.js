const BaseAnalysis = require('../../BaseAnalysis.js')
//Finding the average cargo (of a given type: cones or cubes) over all teams to a certain positions (scoring or feeding to team)

class cargoCountAll extends BaseAnalysis {
    static name = `cargoCountAll`

    constructor(db, type, location) {
        super(db)
       
        this.location = location

        this.average = 0
        this.objectType = type
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
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        for (var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]
                            if(subArr[1] === a.objectType)
                            {
                                object = true
                            }
                            if (subArr[1] === a.location && object == true) {
                                makes++
                                object = false

                            }
                            else if (subArr[1] >= 2 && subArr[1] <= 4) {
                                object = false
                            }
                          
                        }
                        arr.push(makes)
                        len++

                    }
                }
                a.average = makes / len
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
                return data
            })
    }

    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getCount().catch((err) => {
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
            "result": this.average,
            "array" : this.array,
            "team": this.team
        }
    }

}

module.exports = cargoCountAll
