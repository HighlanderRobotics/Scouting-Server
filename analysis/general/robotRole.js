const { help } = require('mathjs')
const BaseAnalysis = require('../BaseAnalysis.js')

class robotRole extends BaseAnalysis {
    static name = `robotRole`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.start = start
        // this.end = end
        this.defense = 0
        this.offense = 0
        this.helper = 0
        this.array = []
        this.matches = []
        this.mainRole = -1

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
            let helper = 0
            let offense = 0
            let defense = 0
            let arr = []
            let match = []

            this.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    if (rows != undefined) {
                        rows.forEach(functionAdder);
                        function functionAdder(row, index, array) {
                            let curr = JSON.parse(row.scoutReport).robotRole
                            match.push(row.key)
                            arr.push(curr)

                            if (curr === 1) {
                                defense++
                            }
                            if (curr === 0) {
                                offense++
                            }
                            if (curr === 2) {
                                helper++
                            }

                        }
                        a.offense = offense
                        a.defense = defense
                        a.helper = helper
                        a.array = arr
                        a.matches = match
                        if (offense >= defense && offense >= helper) {
                            a.mainRole = 0
                        }
                        else if (defense >= helper) {
                            a.mainRole = 1
                        }
                        else {
                            a.mainRole = 2
                        }
                    }
                    console.log(a.mainRole)

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
            var temp = await a.getData().catch((err) => {
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
            "defense": this.defense,
            "offense": this.offense,
            "feeder": this.helper,
            "array": this.array.map((item, index) => ({
                "match": this.matches[index],
                "value": item,
            })),
            "mainRole": this.mainRole,
            "team": this.team
        }
    }
}
module.exports = robotRole

