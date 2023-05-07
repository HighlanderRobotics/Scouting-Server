const math = require('mathjs')
const BaseAnalysis = require('../../BaseAnalysis.js')


//averge amount of cargo (of given type: cube or cone) for a given level (1 or 2 or 3) for a speficied team
class levelCargo extends BaseAnalysis {
    static name = `levelCargo`

    constructor(db, team, type, level) {
        super(db)
        this.team = team
        this.level = level
        this.objectType = type
        this.average = 0
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
            let object = false
            let match = []
            let arr = []
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let makes = 0
                        match.push(row.key)
                        let curr = JSON.parse(row.scoutReport).events
                        for (var i = 0; i < curr.length; i++) {
                            let subArr = curr[i]
                            
                            if(subArr[1] === a.objectType)
                            {                   
                                object = true
                            }
                            if (subArr[1] === 2 && object == true) {
                                let temp = Math.ceil(subArr[2]/3)
                                if(temp === a.level)
                                {
                                    makes++
                                    object = false
                                }
                             

                            }
                            else if (subArr[1] === 3 || subArr[1] === 4) {
                                object = false
                            }

                        }
                        arr.push(makes)
                    }

                }
                a.average = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
                a.array = arr
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
module.exports = levelCargo
