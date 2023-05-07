const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cargoCountAuto.js')
const all = require('./cargoCountAutoAll.js')
//gives the difference between team average and average over all teams of an object score in auto
class cargoCountAutoDifference extends BaseAnalysis {
    static name = `cargoCountAutoDifference`

    constructor(db, team, objectType) {
        super(db)
        this.objectType  = objectType
        this.team = team
        this.result = 0
        this.objectType = objectType

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.objectType)
        await x.runAnalysis()
        let teamAvg = x.average
        let y = new all(a.db, a.objectType)
        await y.runAnalysis()
        let overallAvg = y.result
        a.result = teamAvg - overallAvg

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
            "team": this.team,
        }
    }

}
module.exports = cargoCountAutoDifference
