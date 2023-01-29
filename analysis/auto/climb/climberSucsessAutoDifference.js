const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./climberSucsessAuto.js')
const all = require('./climberSucsessAutoAll.js')
const math = require('mathjs')


// const Manager = require('./manager/dbmanager.js')

class climberSucsessAutoDifference extends BaseAnalysis {
    static name = `climberSucsessAutoDifference`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.off = 0
        this.tipped = 0
        this.level = 0
        this.zScore = 0  
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team)
        await x.runAnalysis()

        let y = new all(a.db)
        await y.runAnalysis()

        let allRate = ((y.level + 1)/(y.totalAttempted + 3) * 12) + ((y.tipped + 1)/(y.totalAttempted + 3) * 8)
        let teamRate = ((x.level + 1)/(x.totalAttempted + 3) * 12) + ((x.tipped + 1)/(x.totalAttempted + 3) * 8)

        let temp = math.std(y.array)
        a.zScore = (teamRate - allRate)/temp

        
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
            // "tipped": this.tipped,
            // "level": this.level,
            // "team": this.team,
            "zScore" : this.zScore
        }
    }

}
module.exports = climberSucsessAutoDifference
