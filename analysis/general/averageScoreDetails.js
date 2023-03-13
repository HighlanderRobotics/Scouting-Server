const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const difference = require('./averageScoreDifference.js')
const level = require('../teleop/cargo/levelCargo')
const climb = require('../teleop/climber/climberSucsess')
const math = require('mathjs')


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
        console.log(team.res)
        await team.runAnalysis()
        let allAvg = new all(a.db, a.type)
        await allAvg.runAnalysis()
        let diff = new difference(a.db, a.team, a.type)
        await diff.runAnalysis()
        
        a.result = team.average
        a.all = allAvg.average
        a.difference = diff.result
        a.array = team.finalizeResults().array



        let oneCone = new level(a.db, a.team, 1, 1)
        await oneCone.runAnalysis()

        let twoCone = new level(a.db, a.team, 1, 2)
        await twoCone.runAnalysis()

        let threeCone = new level(a.db, a.team, 1, 3)
        await threeCone.runAnalysis()

        let oneCube = new level(a.db, a.team, 0, 1)
        await oneCube.runAnalysis()

        let twoCube = new level(a.db, a.team, 0, 2)
        await twoCube.runAnalysis()

        let threeCube = new level(a.db, a.team, 0, 3)
        await threeCube.runAnalysis()

        let climbAvg = new climb(a.db, a.team)
        await climbAvg.runAnalysis()

        let pieChart = {"coneOne" : (oneCone.result * 2)/a.result, "coneTwo" : (twoCone.result * 3)/a.result, "coneThree" : (threeCone.result * 5)/a.result, "cubeOne" : (oneCube.result * 2)/a.result, "cubeTwo" : (twoCube.result * 3)/a.result, "cubeThree" : (threeCube.result * 5)/a.result, "climb" : ((climbAvg.level * 10 + climbAvg.tipped * 8)/climbAvg.totalAttempted)/a.result}
        a.scoringBreakdown = pieChart
       
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
            "result" : this.result,
            "all" : this.all,
            "difference" : this.difference,
            "array" : this.array,
            "scoringBreakdown" : this.scoringBreakdown,
            "team" : this.team
        }
    }

}
module.exports = averageScoreDetails
