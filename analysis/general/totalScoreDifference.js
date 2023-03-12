const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./scoreForPreiction')
const all = require('./totalScoreAll')
const math = require('mathjs')


// const Manager = require('./manager/dbmanager.js')

class totalScoreDifference extends BaseAnalysis {
    static name = `totalScoreDifference`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        //auto = 0
        //teleop = 1
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()
        let teamAvg = x.average
        let y = new all(a.db)
        await y.runAnalysis()
        let temp = math.std(y.array)
        let overallAvg = y.average
        a.result = teamAvg - overallAvg
        a.zScore = a.result / temp
        if(isNaN(a.zScore))
        {
            a.zScore = 0
        }


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
            "result": this.result,
            "team": this.team,
            "zScore" : this.zScore
        }
    }

}
module.exports = totalScoreDifference
