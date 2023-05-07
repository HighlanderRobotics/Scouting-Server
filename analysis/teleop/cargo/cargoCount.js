const BaseAnalysis = require('../../BaseAnalysis.js')
//finding the differece in average cargo (of a given type: cones or cubes) of a team specificed team to a certain positions (scoring or feeding to team)

class cargoCount extends BaseAnalysis {
    static name = `cargoCount`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        this.location = location
        //cones and cubes
        //0 - cubes and 1 - cones
        this.objectType = type
        this.average = 0
        this.maxRow = 0
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
                        let inner = 0
                        match.push(row.key)
                        let curr = JSON.parse(row.scoutReport).events

                        for (var i = 0; i < curr.length; i++) {
                            //change numbers
                            let subArr = curr[i]

                            if(subArr[1] === a.objectType)
                            {
                                object = true
                            }
                            if (subArr[1] === a.location && object === true) {

                                makes++
                                inner ++
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
                        arr.push(inner)
                    }

                }
                //CHECK MATH.CEIL()
                a.array =arr.map((item, index) => ({
                    "match": match[index],
                    "value": item,
                }))
                a.average = makes / len
                a.maxRow = Math.ceil(highest / 3)
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
            var temp = await a.getAccuracy().catch((err) => {
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
            "array": this.array,
            "max": this.maxRow
        }
        
    }

}
module.exports = cargoCount
