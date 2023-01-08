const BaseAnalysis = require('./BaseAnalysis.js')

class climberMax extends BaseAnalysis {
    static name = `climberMax`

    constructor(db, team, start, end) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        this.start = start
        this.end = end
        this.result = 0

    }
    async getClimberMax() {
        let a = this
        return new Promise(async (resolve, reject) => {
            //why does await not work when it works in  bestAverageForMetric

            var sql = `SELECT MAX(scoutReport.challengeResult)
                FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
                WHERE data.startTime BETWEEN COALESCE(?, (SELECT MIN(startTime) FROM data)) AND COALESCE(?, (SELECT MAX(startTime) FROM data))
                ORDER BY data.startTime ASC`;
            this.db.all(sql, [a.team, a.start, a.end], (err, row) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(row[0])
                }
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
        let a = this
        return new Promise(async (resolve, reject) => {
            var temp = await a.getClimberMax().catch((err) => {
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
            "team": this.team,
            "result": this.result
        }
    }
}
module.exports = climberMax
