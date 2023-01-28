const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cycling.js')
const all = require('./cyclingAll.js')
const differenceCycle = require('./cyclingDifference.js')


// const Manager = require('./manager/dbmanager.js')

class cycleOverviewAnalysis extends BaseAnalysis {
    static name = `cycleOverviewAnalysis`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.type = type
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
       this.result = 0
       this.all = 0
       this.difference = 0
       this.array = []
       


        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type, 2)
        await x.runAnalysis()
        let y = new all(a.db, a.type, 2)
        await y.runAnalysis()
        let difference = new differenceCycle(a.db, a.team, a.type,2)
        await difference.runAnalysis()
       


       a.result = x.result
       a.array = x.finalizeResults().array
       a.all = y.result
       a.difference = difference.result
       console.log(a.team)


    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            resolve("done")

        })

    }
    finalizeResults() {
        return {
            "result" : this.result,
           "array" : this.array,
           "difference" : this.difference,
           "all" : this.all,
           "team" : this.team 
            
        }
    }

}
module.exports = cycleOverviewAnalysis
