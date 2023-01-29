const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cargoCountAuto.js')
const all = require('./cargoCountAutoAll.js')
const difference = require('./cargoCountAutoDifference.js')
const autoPaths = require('./autoPaths')

// const Manager = require('./manager/dbmanager.js')

class cargoCountAutoOverview extends BaseAnalysis {
    static name = `cargoCountAutoOverview`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.result = 0
        this.array = 0
        this.all = 0
        this.difference = 0
        this.type = type
        this.autoPath = []
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type)
        await x.runAnalysis()
        let y = new all(a.db, a.type)
        await y.runAnalysis()
        let z = new difference(a.db, a.team, a.type)
        await z.runAnalysis()

        var autoPath = new autoPaths(a.db, a.team)
        await autoPath.runAnalysis()

        a.autoPath = autoPath.paths
        a.result = x.result
        a.array = x.finalizeResults().array
        a.all = y.result
        a.difference = z.result

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
            "autoPaths" : this.autoPath,
            "team": this.team,
        }
    }

}
module.exports = cargoCountAutoOverview
