const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./averageScore.js')
const all = require('./averageScoreAll.js')
const math = require ('mathjs')

// const Manager = require('./manager/dbmanager.js')

class avgAutoCargo extends BaseAnalysis {
    static name = `avgAutoCargo`

    constructor(db, team) {
        super(db)
        this.team = team
        this.result = 0
        //auto = 0
        //teleop = 1
        this.zScore = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, 0)
        x.cargo = 1
        await x.runAnalysis()
        let teamAvg = x.average
        let y = new all(a.db, 0)
        y.cargo = 1
        await y.runAnalysis()
        let overallAvg = y.average
        let difference  = teamAvg - overallAvg
        let temp = math.std(y.array)
        a.zScore = difference /temp
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
            "zScore": this.zScore,
            "team": this.team,
        }
    }

}
module.exports = avgAutoCargo
