const BaseAnalysis = require('../BaseAnalysis.js')

class climberSucsessAutoAll extends BaseAnalysis {
    static name = `climberSucsessAutoAll`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.start = start
        // this.end = end
        this.tipped = 0
        this.failed = 0
        this.noClimb = 0
        this.level = 0
        this.array = []

    }
    async getData() {
        let a = this
        return new Promise(async (resolve, reject) => {
            //why does await not work when it works in  bestAverageForMetric
            var sql = `SELECT scoutReport
                    FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey)
                     AS  newMatches ON  data.matchKey = newMatches.key
                `;
            let fullyOn = 0
            let tipped = 0
            let off = 0
            let none = 0
            let arr = []

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.loag(err)
                    reject(err)
                }
                else {

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).challengeResultAuto
                        arr.push(curr)
                        if (curr === 0) {
                            none++
                        }
                        if (curr === 1) {
                            tipped++
                        }
                        if (curr === 2) {
                            fullyOn++
                        }
                        if(curr == 3)
                        {
                            failed++
                        }

                    }
                    a.tipped = tipped  
                    a.level = fullyOn 
                    a.failed = off 
                    a.noClimb = none
                    a.array = arr


                }
            })

            // console.log(all)



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
            "noClimb" : this.none,
            "team": this.team
        }
    }
}
module.exports = climberSucsessAutoAll

