const { row } = require('jstat')
const BaseAnalysis = require('../../BaseAnalysis.js')
//breakdowns of auto climbing:
//tipped, level, failed and no climb
//array : w enums
//breakdown : w words
class climberSucsessAuto extends BaseAnalysis {
    static name = `climberSucsessAuto`

    constructor(db, team) {
        super(db)
        this.team = team
        this.tipped = 0
        this.noClimb = 0
        this.level = 0
        this.failed = 0
        this.arrayEnum = []
        this.matches = []
        this.breakdownWords = []

    }
    async getData() {
        let a = this
        return new Promise(async (resolve, reject) => {
            var sql = `SELECT scoutReport, newMatches.key AS key
                    FROM data
                JOIN (SELECT matches.key AS key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
                `;
            let level = 0
            let tipped = 0
            let failed = 0
            let noClimb = 0
            let arr = []
            let match = []
            a.totalAttempted = 0
            let climbBreakdown = []

            this.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    if(rows == undefined)
                    {
                        resolve
                    }
                    (rows || []).forEach(functionAdder);
                     rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).autoChallengeResult
                        match.push(row.key)
                        arr.push(curr)
                        if (curr === 0) {
                            noClimb++
                        }
                        if (curr === 1) {
                            tipped++
                            climbBreakdown.push("docked")
                        }
                        if (curr === 2) {
                            level++
                            climbBreakdown.push("engaged")
                        }
                        if(curr == 3)
                        {
                            failed++
                            climbBreakdown.push("failed")
                        }

                    }
                
                    a.tipped = tipped
                    a.level = level 
                    a.failed = failed 
                    a.noClimb = noClimb
                    a.arrayEnum = arr 
                    a.matches = match
                    a.totalAttempted = tipped + failed + level
                    a.breakdownWords = climbBreakdown
                    resolve("done")


                }
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
            await a.getData().catch((err) => {
                if (err) {
                    console.log(err)
                    return err
                }
            })
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "failed": this.failed,
            "level": this.level,
            "tipped": this.tipped,
            "noClimb" : this.noClimb,
            "array": this.arrayEnum.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            })),
            "totalAttempts" : this.totalAttempted,
            "team": this.team,
            "breakdown": this.breakdownWords.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            }))
        }
    }
}
module.exports = climberSucsessAuto

