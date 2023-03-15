const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const difference = require('./averageScoreDifference.js')
const level = require('../teleop/cargo/levelCargo')
const climb = require('../teleop/climber/climberSucsess')
const math = require('mathjs')
const { resolve } = require('mathjs')


// const Manager = require('./manager/dbmanager.js')

class scoringBreakdown extends BaseAnalysis {
    static name = `scoringBreakdown`

    constructor(db, team, type, match) {
        super(db)
        this.team = team
        this.array = []
        this.all = 0
        this.type = type
        this.difference = 0
        this.scoringBreakdown = {}
        this.matchKey = match
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



        if (!a.matchKey) {

            let pieChart = { "coneOne": (oneCone.result * 2) / a.result, "coneTwo": (twoCone.result * 3) / a.result, "coneThree": (threeCone.result * 5) / a.result, "cubeOne": (oneCube.result * 2) / a.result, "cubeTwo": (twoCube.result * 3) / a.result, "cubeThree": (threeCube.result * 5) / a.result, "climb": ((climbAvg.level * 10 + climbAvg.tipped * 8) / climbAvg.totalAttempted) / a.result }
        
            a.scoringBreakdown = pieChart
        }
        else {
            let index = -1
            for (let i = 0; i < a.array.length; i ++)
            {
                if(a.array[i].match === a.matchKey)
                {
                    index = i
                }
            }
            if (index>= 0) {
                let tempClimb = climbAvg.finalizeResults().array[index].value
                if (tempClimb === 2) {

                    tempClimb = 10
                }
                else if (tempClimb === 1) {
                    tempClimb = 8
                }
                else {
                    tempClimb = 0
                }
                let totalThisMatch = a.array[index].value
                console.log(a.array)

                let pieChart = { "coneOne": (oneCone.finalizeResults().array[index].value * 2) / totalThisMatch, "coneTwo": (twoCone.finalizeResults().array[index].value * 3) / totalThisMatch, "coneThree": (threeCone.finalizeResults().array[index].value * 5) / totalThisMatch, "cubeOne": (oneCube.finalizeResults().array[index].value * 2) / totalThisMatch, "cubeTwo": (twoCube.finalizeResults().array[index].value * 3) / totalThisMatch, "cubeThree": (threeCube.finalizeResults().array[index].value * 5) / totalThisMatch, "climb": tempClimb / totalThisMatch }
                a.scoringBreakdown = pieChart
            }
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
          
            "scoringBreakdown": this.scoringBreakdown,
            "team": this.team
        }
    }

}
module.exports = scoringBreakdown
