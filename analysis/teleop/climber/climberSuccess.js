const BaseAnalysis = require('../../BaseAnalysis.js')

class climberSuccess extends BaseAnalysis {
    static name = `climberSuccess`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.start = start
        // this.end = end
        this.tipped = 0
        this.off = 0
        this.level = 0
        this.array = []
        this.matches = []

    }
    async getData() {
        let a = this
        return new Promise(async (resolve, reject) => {
            //why does await not work when it works in  bestAverageForMetric
            var sql = `SELECT scoutReport, newMatches.key AS key
                    FROM data
                JOIN (SELECT matches.key AS key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
                `;
            let fullyOn = 0
            let tipped = 0
            let off = 0
            let arr = []
            let match = []

            this.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).challengeResult
                        match.push(row.key)
                        arr.push(curr)
                        if (curr === 0) {
                            off++
                        }
                        if (curr === 1) {
                            tipped++
                        }
                        if (curr === 2) {
                            fullyOn++
                        }

                    }
                    a.tipped = tipped / arr.length
                    a.level = fullyOn / arr.length
                    a.off = off / arr.length
                    a.array = arr
                    a.matches = match


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
            "off": this.off,
            "level": this.level,
            "tipped": this.tipped,
            "array": this.array,
            "matches" : this.matches,
            "team": this.team
        }
    }
}
module.exports = climberSuccess

