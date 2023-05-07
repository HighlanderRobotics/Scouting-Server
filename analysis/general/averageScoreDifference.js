const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./averageScore.js')
const all = require('./averageScoreAll.js')

//difference between spcified team and all teams for average score of either teleop or auto (given in the variable: autoOrTele)
class averageScoreDifference extends BaseAnalysis {
    static name = `averageScoreDifference`

    constructor(db, team, autoOrTele) {
        super(db)
        this.team = team
        this.average = 0
        //auto = 0
        //teleop = 1
        this.autoOrTele = autoOrTele
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.autoOrTele)
        await x.runAnalysis()
        let teamAvg = x.average
        let y = new all(a.db, a.autoOrTele)
        await y.runAnalysis()
        let overallAvg = y.average
        a.average = teamAvg - overallAvg

    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            // a.result = temp  

            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            "team": this.team,
        }
    }

}
module.exports = averageScoreDifference
