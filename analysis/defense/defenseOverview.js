const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./defenseTeam.js')
const all = require('./defenseAll.js')
const difference = require('./defenseDifference.js')
const math = require('mathjs')

//packahes all, array, team average and difference together
//also produces z-Score for picklists
class defenseOverview extends BaseAnalysis {
    static name = `defenseOverview`

    constructor(db, team) {
        super(db)
        this.team = team
        this.zScore = 0
        this.result = 0
        this.array = []
        this.all = 0
        this.difference = 0

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
        if(isNaN(a.zScore))
        {
            a.zScore = 0
        }


    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
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
