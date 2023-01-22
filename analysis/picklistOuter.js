const Manager = require('../manager/dbmanager')
const picklist = require('./picklist')
const BaseAnalysis = require('./BaseAnalysis')



class picklistOuter extends BaseAnalysis {
    static name = `picklistOuter`

    constructor(db, tourmentKey, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, auto, teleOp) {
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

    }
   

    async getPicklist() {
        let a = this
        return new Promise(async function (resolve, reject) {
            let arr = []
            var sql = `SELECT teamNumber
                    FROM teams
                    JOIN matches on matches.teamKey = teams.key
                    WHERE matches.tournamentKey = ?
                        GROUP BY teamNumber `;
            a.db.all(sql, [a.tourmentKey], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    console.log(rows)
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = new picklist(a.db, row.teamNumber, a.coneOneScore, a.coneTwoScore, a.coneThreeScore, a.cubeOneScore, a.cubeTwoScore, a.cubeThreeScore, a.auto, a.teleOp)
                        curr.runAnalysis()
                        let temp = {"team" : row.teamNumber, "result" : curr.result}
                        arr.push(temp)
                    }
                

                }
                arr.sort(function(a, b) {
                    return b.result - a.result;
                });
                a.result = arr
                console.log("result" + a.result)
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
module.exports = picklistOuter
