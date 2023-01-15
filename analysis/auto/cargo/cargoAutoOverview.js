const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cargoCountAuto.js')
const all = require('./cargoCountAutoAll.js')
const difference = require('./cargoCountAutoDifference.js')

// const Manager = require('./manager/dbmanager.js')

class cargoCountAutoOverview extends BaseAnalysis {
    static name = `cargoCountAutoOverview`

    constructor(db, team, type, start) {
        super(db)
        this.team = team
        this.type = type
        this.start = start
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = 0
        this.all = 0
        this.difference = 0
        this.type = type
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type, a.start)
        await x.runAnalysis()
        let y = new all(a.db, a.type, a.start)
        await y.runAnalysis()
        let z = new difference(a.db, a.team, a.type, a.start)
        await z.runAnalysis()

        a.result = x.result
        a.array = x.array
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
            "team": this.team,
        }
    }

}
module.exports = cargoCountAutoOverview
