const BaseAnalysis = require('../BaseAnalysis.js')
//returns array of notes from specified team

class notes extends BaseAnalysis {
    static name = `notes`

    constructor(db, team) {
        super(db)
        this.team = team
        this.notes = []
    }
    async getNotes() {
        let a = this
        return new Promise(function (resolve, reject) {
            var sql = `SELECT notes, uuid, newMatches.matchNumber AS matchNum, newMatches.key AS matchKey
                FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    a.notes = rows
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
module.exports = notes