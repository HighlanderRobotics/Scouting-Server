const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cycling.js')
const all = require('./cyclingAll.js')

// const Manager = require('./manager/dbmanager.js')

class cyclingDifference extends BaseAnalysis {
    static name = `cyclingDifference`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        this.type = type
        this.location = location
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type, a.location)
        await x.runAnalysis()
        let teamAvg = x.result
        let y = new all(a.db, a.type, a.location)
        await y.runAnalysis()
        let overallAvg = y.result

        a.result = teamAvg - overallAvg

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
            "team": this.team,
        }
    }

}
module.exports = cyclingDifference
