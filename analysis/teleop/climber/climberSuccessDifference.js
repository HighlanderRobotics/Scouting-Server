const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./climberSuccess.js')
const all = require('./climberSuccessAll.js')

// const Manager = require('./manager/dbmanager.js')

class climberSuccessDifference extends BaseAnalysis {
    static name = `climberSuccessDifference`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.off = 0
        this.tipped = 0
        this.level = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()
        let teamAvg = x.result
        let y = new all(a.db)
        await y.runAnalysis()


        a.off = teamAvg.off - overallAvg.off
        a.tipped = teamAvg.tipped - overallAvg.tipped
        a.level = teamAvg.level - overallAvg.level

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
            "off": this.off,
            "tipped": this.tipped,
            "level": this.level,
            "team": this.team,
        }
    }

}
module.exports = climberSuccessDifference
