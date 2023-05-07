const BaseAnalysis = require('../../BaseAnalysis.js')
//breakdowns of auto climbing:
//tipped, level, failed and no climb
//array : w enums
class climberSucsessAutoAll extends BaseAnalysis {
    static name = `climberSucsessAutoAll`

    constructor(db, team) {
        super(db)
        this.team = team
        this.tipped = 0
        this.failed = 0
        this.noClimb = 0
        this.level = 0
        this.totalAttempted = 0
        this.array = []

    }
    async getData() {
        let a = this
        return new Promise(async (resolve, reject) => {
            var sql = `SELECT scoutReport
                    FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey)
                     AS  newMatches ON  data.matchKey = newMatches.key
                `;
            let level = 0
            let tipped = 0
            let failed = 0
            let noClimb = 0
            let arr = []

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.loag(err)
                    reject(err)
                }
                else {
                   if(rows != [])
                   {
                        rows.forEach(functionAdder);
                        function functionAdder(row, index, array) {
                            let curr = JSON.parse(row.scoutReport).autoChallengeResult
                            arr.push(curr)
                            if (curr === 0) {
                                noClimb++
                            }
                            if (curr === 1) {
                                tipped++
                            }
                            if (curr === 2) {
                                level++
                            }
                            if (curr == 3) {
                                failed++
                            }

                        }
                        arr.push(((level + 1)/(tipped + level + failed + 3) * 12) + ((tipped + 1)/(tipped + level + failed + 3) * 8))
                    }
                    
                    a.tipped = tipped
                    a.level = level
                    a.failed = failed
                    a.noClimb = noClimb
                    a.array = arr
                    a.totalAttempted = tipped + failed + level
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
            "failed": this.off,
            "level": this.level,
            "tipped": this.tipped,
            "array": this.array,
            "noClimb": this.none,
            "team": this.team,
            "allAttempts" : this.allAttempts
        }
    }
}
module.exports = climberSucsessAutoAll

