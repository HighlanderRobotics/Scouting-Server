const BaseAnalysis = require('../BaseAnalysis.js')
//returns array of notes from specified team

class updateEPA extends BaseAnalysis {
    static name = `updateEPA`

    constructor(db, team, matchNumber) {
        super(db)
        this.team = team
        this.matchNumber = matchNumber
        this.notes = []
    }
    async getNotes() {
        let a = this
        return new Promise(function (resolve, reject) {
            var sql = `SELECT DISTINCT matchKey
            FROM newData
            JOIN (SELECT *
                FROM data 
                JOIN data ON matches.key
                WHERE matches.matchNumber = ?) AS  newData`
            a.db.all(sql, [a.matchNumber], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {

                    resolve(rows)
                }
            })


        })
    }
    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            var temp = await a.getNotes().catch((err) => {
                if (err) {
                    return err
                }
            })
            a.notes = temp
            resolve(temp)
        })

    }
    finalizeResults() {
        return {
            "result": this.notes,
            "team": this.team
        }
    }
}
module.exports = updateEPA