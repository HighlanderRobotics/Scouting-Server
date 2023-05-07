const BaseAnalysis = require('../BaseAnalysis.js')

//average driver ability over all teams
class driverAbilityAll extends BaseAnalysis {
    static name = `driverAbilityAll`

    constructor(db) {
        super(db)
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
                JOIN teams ON teams.key = matches.teamKey) 
                AS  newMatches ON  data.matchKey = newMatches.key
          `;
           let arr = []
            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).driverAbility
                        arr.push(curr)
                    }
                }
                a.array = arr
                a.average = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length


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
            "result": this.average,
            "array" : this.array
        }
    }

}
module.exports = driverAbilityAll
