const BaseAnalysis = require('../../BaseAnalysis.js')
//charing in teleop for a spefiied team:
//# of matches for: no climb, tipped, level, and failed
//array with match number
//adjusted tipped level rate, and points
//adjusted uses the rule of sucsession ( numerator + 1 / demoninator + 3)
class climberSucsess extends BaseAnalysis {
    static name = `climberSucsess`

    constructor(db, team) {
        super(db)
        this.team = team
        this.tipped = 0
        this.noClimb = 0
        this.level = 0
        this.failed = 0
        this.totalAttempted = 0
        this.array = []
        this.matches = []
        this.adjustedLevel = 0
        this.adjustedTipped = 0
        this.adjustedPoints = 0
        this.breakdown = []
        this.averagePoints = 0

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
            let climbBreakdown = []

            this.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    if (rows != undefined) {

                        rows.forEach(functionAdder);
                        function functionAdder(row, index, array) {
                            let curr = JSON.parse(row.scoutReport).challengeResult
                            match.push(row.key)
                            arr.push(curr)
                            if (curr === 0 || curr === 4) {
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
                            if (curr == 3) {
                                failed++
                                climbBreakdown.push("failed")

                            }

                        }
                    }
                        a.tipped = tipped
                        a.level = level
                        a.failed = failed
                        a.noClimb = noClimb
                        a.array = arr
                        a.matches = match
                        a.totalAttempted = tipped + level + failed
                        a.adjustedLevel = (a.level + 1)/(a.totalAttempted -a.tipped + 3)
                        a.adjustedTipped = (a.tipped + 1)/(a.totalAttempted  - a.level+ 3)
                        a.adjustedPoints = (a.adjustedLevel * 10 + a.adjustedTipped * 6)
                        a.breakdown = climbBreakdown
                        a.averagePoints =((a.tipped * 6) + (a.level * 10))/2

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
            await a.getData().catch((err) => {
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
            "failed": this.failed,
            "level": this.level,
            "tipped": this.tipped,
            "noClimb": this.noClimb,
            "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            })),
            "totalAttempted" : this.totalAttempted,
            "team": this.team,
            "adjustedPoints" : this.adjustedPoints,
            "breakdown": this.breakdown.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            }))
        }
    }
}
module.exports = climberSucsess

