const BaseAnalysis = require('../BaseAnalysis.js')
const teamStat = require('./defenseEvent.js')
const all = require('./defenseEventAll.js')

// const Manager = require('./manager/dbmanager.js')

class defenseEventDifference extends BaseAnalysis {
    static name = `defenseEventDifference`

    constructor(db, team, type) {
        super(db)
        this.team = team
        this.type = type
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type)
        await x.runAnalysis()
        let teamAvg = x.result
        let y = new all(a.db, a.type)
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
module.exports = defenseEventDifference
