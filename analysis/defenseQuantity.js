const BaseAnalysis = require('./BaseAnalysis.js')

class defenseQuantity extends BaseAnalysis {
    static name = `defenseQuantity`

    constructor(db, teamKey, start, end) {
        super(db)
        this.team = teamKey
        this.start = start
        this.end = end
        this.result = 0
    }
    async getDefenseQuantity() {
        let a = this
        return new Promise(async function (resolve, reject) {
            let sql = `SELECT SUM(defenseQuantity) AS dSum, COUNT(*) AS size
            FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
            WHERE data.startTime BETWEEN COALESCE(?, (SELECT MIN(startTime) FROM data)) AND COALESCE(?, (SELECT MAX(startTime) FROM data))
            ORDER BY data.startTime ASC`
            a.db.all(sql, [a.team, a.start, a.end], (err, row) => {
                if (err) {
                    reject(err)
                }
                
                let temp = row[0].dSum / row[0].size
                a.result = temp
                resolve(temp)
            })
        })
    }
    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getDefenseQuantity().catch((err) => {
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
module.exports = defenseQuantity