const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./defenseEvent.js')
const all = require('./defenseEventAll.js')
const difference = require('./defenseEventDifference.js')
const math = require('mathjs')

// const Manager = require('./manager/dbmanager.js')

class defenseOverview extends BaseAnalysis {
    static name = `defenseOverview`

    constructor(db, team) {
        super(db)
        this.team = team
        this.zScore = 0
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = 0
        this.all = 0
        this.difference = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()
        let y = new all(a.db)
        await y.runAnalysis()
        let z = new difference(a.db, a.team)
        await z.runAnalysis()
        a.result = x.result
        a.array = x.finalizeResults().array
        a.all = y.result
        a.difference = z.result
        let temp = math.std(y.array)
        a.zScore = a.difference / temp


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
            "array" : this.array,
            "difference" : this.difference,
            "all" : this.all,
            "zScore" : this.zScore,
            "team": this.team,
        }
    }

}
module.exports = defenseOverview
