const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cycling.js')
const all = require('./cyclingAll.js')
const difference = require('./cyclingDifference.js')

// const Manager = require('./manager/dbmanager.js')

class cyclingDetials extends BaseAnalysis {
    static name = `cyclingDetials`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
       this.result = 0
       this.array = []
       this.all = 0
       this.difference = 0
       this.type = type
       this.location = location


        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type, a.location)
        await x.runAnalysis()
        a.result = x.result
        a.array = x.array
        let y = new all(a.db, a.type, a.location)
        await y.runAnalysis()
        a.all = y.result
        let z = new difference(a.db, a.team,a.type, a.location)
        await z.runAnalysis()
        a.difference = z.result



        let cube = new cargoCount(a.db, 1, )

    

        


        
        

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
           "all" : this.all,
           "difference" : this.difference,
           "team" : this.team 
            
        }
    }

}
module.exports = cyclingDetials
