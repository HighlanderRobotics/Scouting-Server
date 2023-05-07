const BaseAnalysis = require('../BaseAnalysis.js')
//average driver ability for a specific team, also includes array with matches

class driverAbilityTeam extends BaseAnalysis {
    static name = `driverAbilityTeam`

    constructor(db, team) {
        super(db)
        this.team = team

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
            let arr = []
            let match = []
            let len = 0
            let makes = 0
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).driverAbility
                        match.push(row.key)
                        arr.push(curr)
                    }
                }
                a.array = arr
                a.average = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
                a.matches = match
                if (isNaN(a.average))
                {
                    a.average = 0
                }

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
module.exports = driverAbilityTeam
