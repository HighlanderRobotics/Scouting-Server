// const BaseAnalysis = require('./BaseAnalysis.js')
const BaseAnalysis = require('./BaseAnalysis.js')

class defenseQuality extends BaseAnalysis {
    static name = `defenseQuality`

    constructor(db, teamKey, start, end) {
        super(db)
        this.team = teamKey
        this.start = start
        this.end = end
        this.result = 0
    }
    async getDefenseQuality() {
        let a = this
        return new Promise(async function (resolve, reject) {
            let sql = `SELECT SUM(defenseQuality) AS dSum, COUNT(*) AS size
            FFROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
          `
            a.db.all(sql, [a.team], (err, row) => {
                if (err) {
                    reject(err)
                }
                console.log(a.team)
                let temp = row[0].dSum / row[0].size
                a.result = temp
                resolve(temp)
            })
        })
    }
    runAnalysis() {
        let a = this

        return new Promise(async (resolve, reject) => {
            var temp = a.getDefenseQuality().catch((err) => {
                if (err) {
                    return err
                }
            })
            a.result = temp
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team
        }
    }
}
module.exports = defenseQuality