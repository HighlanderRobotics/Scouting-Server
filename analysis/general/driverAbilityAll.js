const BaseAnalysis = require('../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class driverAbilityAll extends BaseAnalysis {
    static name = `driverAbilityAll`

    constructor(db) {
        super(db)
        this.result = 0

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
            let len = 0
            let total = 0
            a.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).driverAbility
                        total += curr
                    }
                }
                a.result = total/len

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
            "result": this.result
        }
    }

}
module.exports = driverAbilityAll
