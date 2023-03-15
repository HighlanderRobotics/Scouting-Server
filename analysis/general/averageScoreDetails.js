const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const difference = require('./averageScoreDifference.js')
const level = require('../teleop/cargo/levelCargo')
const climb = require('../teleop/climber/climberSucsess')
const math = require('mathjs')
const { resolve } = require('mathjs')


// const Manager = require('./manager/dbmanager.js')

class averageScoreDetails extends BaseAnalysis {
    static name = `averageScoreDetails`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.array = []
        this.all = 0
        this.type = type
        this.difference = 0
        this.scoringBreakdown = {}
    }
    async getAccuracy() {
        let a = this
        let team = new teamStat(a.db, a.team, a.type)
        await team.runAnalysis()
        let allAvg = new all(a.db, a.type)
        await allAvg.runAnalysis()
        let diff = new difference(a.db, a.team, a.type)
        await diff.runAnalysis()

        a.result = team.average
        a.all = allAvg.average
        a.difference = diff.result
        a.array = team.finalizeResults().array


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
            "all": this.all,
            "difference": this.difference,
            "array": this.array,
            "team": this.team
        }
    }

}
module.exports = averageScoreDetails
