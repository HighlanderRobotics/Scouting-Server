const BaseAnalysis = require('../../BaseAnalysis.js')
//charing in teleop for a spefiied team:
//# of matches for: no climb, tipped, level, and failed
//array with match number
class climberSucsessAll extends BaseAnalysis {
    static name = `climberSucsessAll`

    constructor(db, team) {
        super(db)
        this.team = team
        this.tipped = 0
        this.failed = 0
        this.noClimb = 0
        this.level = 0
        this.array = []
        this.totalAttempted = 0

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
            // none = no climb
            //tipped = tipped
            //
            let level = 0
            let tipped = 0
            let failed = 0
            let noClimb = 0
            let arr = []

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    if (rows != undefined) {

                        rows.forEach(functionAdder);
                        function functionAdder(row, index, array) {
                            let curr = JSON.parse(row.scoutReport).challengeResult
                            let temp = 0
                            if (curr === 0) {
                                noClimb++
                            }
                            if (curr === 1) {
                                tipped++
                                temp = 8
                                arr.push(temp)
                            }
                            if (curr === 2) {
                                level++
                                temp = 10
                                arr.push(temp)

                            }
                            if (curr == 3) {
                                failed++
                                temp = 0
                                arr.push(temp)

                            }

                        }
                        a.tipped = tipped
                        a.level = level
                        a.failed = failed
                        a.noClimb = noClimb
                        a.array = arr
                        a.totalAttempted = tipped + level + failed            

    
    
                    }
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
                // console.log(data)
                return data
            })
    }
    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getData().catch((err) => {
                if (err) {
                    console.log(err)
                    return err
                }
            })
            // a.result = temp  
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
            "totalAttempted" : this.totalAttempted,
            "team": this.team
        }
    }
}
module.exports = climberSucsessAll

