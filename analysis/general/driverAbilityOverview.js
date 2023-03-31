const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./driverAblilityTeam')
const all = require('./driverAbilityAll')
const math = require('mathjs')

// const Manager = require('./manager/dbmanager.js')

class driverAbilityOverview extends BaseAnalysis {
    static name = `driverAbilityOverview`

    constructor(db, team) {
        super(db)
        this.team = team
        this.zScore = 0
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = []
        this.all = 0
        this.difference = 0
        this.zScore = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()
        let y = new all(a.db)
        await y.runAnalysis()
        console.log(y.finalizeResults())
        a.result = x.result
        a.array = x.finalizeResults().array
        a.all = y.result
        a.difference = a.result - a.all
        let temp = math.std(y.array)
        a.zScore = a.difference / temp
        console.log("here " + y.array)
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
            "array" : this.array,
            "difference" : this.difference,
            "all" : this.all,
            "zScore" : this.zScore,
            "team": this.team,
        }
    }

}
module.exports = driverAbilityOverview
