const BaseAnalysis = require('../BaseAnalysis.js')
//number of penalities (red and yellow cards only) and array
//array is in format: {"cardType" : curr, "match" : row.key}
class pentalties extends BaseAnalysis {
    static name = `pentalties`

    constructor(db, team) {
        super(db)
        this.team = team
        this.numberOfPenalties = 0
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
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).penaltyCard
                        if (curr >= 1)
                        {
                            arr.push({"cardType" : curr, "match" : row.key})
                        }


                    }
                }
                a.matches = arr
                a.numberOfPenalties = a.matches.length
                if (isNaN(a.numberOfPenalties))
                {
                    a.numberOfPenalties = 0
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
            "result": this.numberOfPenalties,
            "team": this.team,
            "matches": this.matches
            
        }
    }

}
module.exports = pentalties
