const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCount extends BaseAnalysis {
    static name = `cargoCount`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.location = location
        this.type = type
        this.result = 0
        this.max = 0
        this.array = []
        this.matches = []

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
            let len = 0
            let makes = 0
            let highest = 0
            let match = []
            let object = false
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }

                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        match.push(row.key)
                        let curr = JSON.parse(row.scoutReport).events

                        for (var i = 0; i < curr.length; i++) {
                            //change numbers
                            let subArr = curr[i]

                            if(subArr[1] === a.type)
                            {
                                object = true
                            }
                            if (subArr[1] === a.location && object === true) {

                                makes++
                                if(subArr[2] > highest)
                                {
                                    highest = subArr[2]
                                }
                                object = false

                            }
                            else if (subArr[1] >= 2 && subArr[1] <= 4 && object === true) {
                                object = false
                            }

                        }
                        len++
                        arr.push(makes)
                    }

                }
                //CHECK MATH.CEIL()
                a.array =arr.map((item, index) => ({
                    "match": match[index],
                    "value": item,
                }))
                a.result = makes / len
                a.max = Math.ceil(highest / 3)
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
            console.log(a.array)
            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team,
            "array": this.array,
            "max": this.max
        }
        
    }

}
module.exports = cargoCount
