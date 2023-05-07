const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cargoCountAuto.js')
const all = require('./cargoCountAutoAll.js')
const difference = require('./cargoCountAutoDifference.js')
const math = require('mathjs')

//
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
        this.zScore = 0
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


        a.result = x.average
        a.array = x.finalizeResults().array
        a.all = y.result
        a.difference = z.result

        let temp = math.std(y.array)
        a.zScore = z.result  /temp

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
module.exports = cargoCountAutoOverview
