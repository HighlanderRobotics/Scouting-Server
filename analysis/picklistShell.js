const { row } = require('mathjs')
const Manager = require('../manager/dbmanager')
const BaseAnalysis = require('./BaseAnalysis')
const picklist = require('./picklist')
class picklistShell extends BaseAnalysis {
    static name = `picklistShell`

    constructor(db, tourmentKey, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, auto, teleOp, defense) {
        super(db)
        this.tourmentKey = tourmentKey
        this.cubeOneScore = cubeOneScore
        this.cubeTwoScore = cubeTwoScore
        this.cubeThreeScore = cubeThreeScore
        this.auto = auto
        this.teleOp = teleOp
        this.result = []
        this.coneOneScore = coneOneScore
        this.coneTwoScore = coneTwoScore
        this.coneThreeScore = coneThreeScore
        this.defense = defense

    }
   

    async getPicklist() {
        let a = this
        return new Promise(async function (resolve, reject) {
            let arr = []
            var sql = `SELECT teams.teamNumber
                    FROM teams
                    JOIN matches on matches.teamKey = teams.key
                    WHERE matches.tournamentKey = ?
                    GROUP BY teams.teamNumber `;
            a.db.all(sql, [a.tourmentKey], async (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    for (let row in rows)
                    {
                        let curr = new picklist(a.db, rows[row].teamNumber, a.coneOneScore, a.coneTwoScore, a.coneThreeScore, a.cubeOneScore, a.cubeTwoScore, a.cubeThreeScore, a.auto, a.teleOp, a.defense)
                         await  curr.runAnalysis()
                        let temp = {"team" : rows[row].teamNumber, "result" : curr.result}
                        arr.push(temp)
                    }
                    console.log("EMPTY ARRAY")
                    arr.sort(function(a, b) {
                        return b.result - a.result;
                    })
                    

                }
               
                a.result = arr
                resolve("done")

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
            var temp = await a.getPicklist().catch((err) => {
                if (err) {
                    return err
                }
            })

            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result
        }
    }

}
module.exports = picklistShell