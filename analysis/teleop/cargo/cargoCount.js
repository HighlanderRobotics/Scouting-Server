const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCount extends BaseAnalysis {
    static name = `cargoCount`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
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

                rows.forEach(functionAdder);
                function functionAdder(row, index, array) {
                    match.push(row.key)
                    let curr = JSON.parse(row.scoutReport).events

                    for (var i = 0; i < curr.length; i++) {
                        //change numbers
                        let subArr = curr[i]

                        if (subArr[1] === a.type) {
                            object = true
                         }
                         if(subArr[1] === 3)
                         {
                             object = false
                         }
                         if(subArr[1] === 2 && object == true)
                         {
                             makes++
                             if(subArr[2] > highest)
                             {
                                highest = subArr[2]
                             }
                             object = false

                         }
                         if(subArr[1] === 4)
                         {
                             object = false
                         }

                    }
                    len++
                    arr.push(makes)

                }
                //CHECK MATH.CEIL()
                a.array = arr
                a.result = makes / len
                a.max = Math.ceil(highest/3)
                a.matches = match
                console.log(a.result)
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
            "array": this.array,
            "matches" : this.matches,
            "max": this.max
        }
    }

}
module.exports = cargoCount
