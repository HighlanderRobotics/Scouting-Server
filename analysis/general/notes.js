// import BaseAnalysis from './BaseAnalysis.js'
const BaseAnalysis = require('../BaseAnalysis.js')

class notes extends BaseAnalysis {
    static name = `notes`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.start = start
        // this.end = end
        this.result = []
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
            let arr = []
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    a.result = rows
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
            a.result = temp
            resolve(temp)
        })

    }
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team
        }
    }
}
module.exports = notes